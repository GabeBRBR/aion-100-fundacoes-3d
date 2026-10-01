/**
 * BeamMeshFactory.js
 *
 * Fábrica 3D paramétrica de geometrias e malhas (Three.js) para as 22 vigas baldrames
 * da obra AION-100 (VB1 a VB22).
 *
 * Em estrita conformidade com:
 *   - NBR 6118:2023 (Tabela 9.1: pinos de dobramento normativos R = 3.0*phi CA-50, R = 2.0*phi CA-60)
 *   - Requisito R2: Concordância suave em arcos circulares a 90° contínuos C1 sem distorções de Bézier.
 *   - Requisito R3: Confinamento volumétrico estrito (c >= 2.50 cm) em 100% dos tubos e anéis.
 *   - Fôrmas de concreto translúcidas com arestas destacadas para inspeção em Raio-X.
 *   - Armaduras em tubos metálicos PBR (CA-50 nervurado longitudinal e CA-60 estribos).
 *   - Metadados completos em userData para interatividade, clique, tooltip e inspeção técnica.
 *
 * Dual export: Browser (window.BeamMeshFactory) e Node.js (module.exports).
 */

(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['three', '../geometry/CircularArcCurve3', '../geometry/RebarPathBuilder', '../geometry/StirrupPathBuilder'], factory);
  } else if (typeof module === 'object' && module.exports) {
    let THREE = (typeof root !== 'undefined' && root.THREE) ? root.THREE : null;
    if (!THREE) {
      try { THREE = require('three'); } catch (e) { THREE = null; }
    }
    let CircularArcCurve3 = null;
    let RebarPathBuilder = null;
    let StirrupPathBuilder = null;
    try { CircularArcCurve3 = require('../geometry/CircularArcCurve3'); } catch (e) {
      CircularArcCurve3 = (typeof root !== 'undefined') ? root.CircularArcCurve3 : null;
    }
    try { RebarPathBuilder = require('../geometry/RebarPathBuilder'); } catch (e) {
      RebarPathBuilder = (typeof root !== 'undefined') ? root.RebarPathBuilder : null;
    }
    try { StirrupPathBuilder = require('../geometry/StirrupPathBuilder'); } catch (e) {
      StirrupPathBuilder = (typeof root !== 'undefined') ? root.StirrupPathBuilder : null;
    }
    const exported = factory(THREE, CircularArcCurve3, RebarPathBuilder, StirrupPathBuilder);
    module.exports = exported;
    if (typeof root !== 'undefined') {
      root.BeamMeshFactory = exported;
    }
  } else {
    root.BeamMeshFactory = factory(root.THREE, root.CircularArcCurve3, root.RebarPathBuilder, root.StirrupPathBuilder);
  }
}(typeof self !== 'undefined' ? self : (typeof global !== 'undefined' ? global : this), function (THREE, CircularArcCurve3Class, RebarPathBuilderClass, StirrupPathBuilderClass) {
  'use strict';

  // Fallbacks de Vector3 / Group / Mesh se THREE for carregado posteriormente
  function getThree() {
    if (THREE) return THREE;
    if (typeof window !== 'undefined' && window.THREE) return window.THREE;
    if (typeof global !== 'undefined' && global.THREE) return global.THREE;
    return null;
  }

  function getRebarBuilder() {
    if (RebarPathBuilderClass) return RebarPathBuilderClass;
    if (typeof window !== 'undefined' && window.RebarPathBuilder) return window.RebarPathBuilder;
    if (typeof global !== 'undefined' && global.RebarPathBuilder) return global.RebarPathBuilder;
    return null;
  }

  function getStirrupBuilder() {
    if (StirrupPathBuilderClass) return StirrupPathBuilderClass;
    if (typeof window !== 'undefined' && window.StirrupPathBuilder) return window.StirrupPathBuilder;
    if (typeof global !== 'undefined' && global.StirrupPathBuilder) return global.StirrupPathBuilder;
    return null;
  }

  /**
   * Classe BeamMeshFactory
   */
  class BeamMeshFactory {
    /**
     * Cria materiais PBR padrão otimizados para concreto e aços CA-50 / CA-60.
     *
     * @param {Array<THREE.Plane>} [clippingPlanes=[]]
     * @returns {Object} Dicionário de materiais
     */
    static createDefaultMaterials(clippingPlanes = []) {
      const T = getThree();
      if (!T) {
        throw new Error('BeamMeshFactory: Three.js não está carregado.');
      }

      const planes = clippingPlanes || [];

      // Concreto Translúcido com refração física suave
      const concrete = new T.MeshPhysicalMaterial({
        color: 0xcbd5e1,
        transparent: true,
        opacity: 0.35,
        roughness: 0.35,
        metalness: 0.05,
        transmission: 0.25,
        ior: 1.4,
        side: T.DoubleSide,
        depthWrite: false,
        clippingPlanes: planes
      });

      // Arestas de fôrma em azul ciano
      const edges = new T.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.55,
        clippingPlanes: planes
      });

      // Aço CA-50 Longitudinal Inferior (Dourado metálico quente)
      const inf = new T.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.28,
        metalness: 0.85,
        clippingPlanes: planes
      });

      // Aço CA-50 Longitudinal Superior (Azul aço reflexivo)
      const sup = new T.MeshStandardMaterial({
        color: 0x38bdf8,
        roughness: 0.28,
        metalness: 0.85,
        clippingPlanes: planes
      });

      // Aço CA-50 Armadura de Pele (Púrpura metálico)
      const pele = new T.MeshStandardMaterial({
        color: 0xa855f7,
        roughness: 0.28,
        metalness: 0.85,
        clippingPlanes: planes
      });

      // Aço CA-60 Estribos Fechados (Verde cromo metálico)
      const stirrup = new T.MeshStandardMaterial({
        color: 0x10b981,
        roughness: 0.25,
        metalness: 0.90,
        clippingPlanes: planes
      });

      return { concrete, edges, inf, sup, pele, stirrup };
    }

    /**
     * Instancia a malha de fôrma de concreto de uma viga baldrame com suas arestas destacadas.
     *
     * @param {Object} beam - Objeto com dados paramétricos da viga
     * @param {THREE.Material} concreteMat
     * @param {THREE.Material} edgesMat
     * @returns {{ mesh: THREE.Mesh, edges: THREE.LineSegments }}
     */
    static buildBeamFormwork(beam, concreteMat, edgesMat) {
      const T = getThree();
      if (!T) throw new Error('BeamMeshFactory: Three.js não disponível.');

      const box = beam.box || beam.prismBox;
      if (!box) throw new Error(`BeamMeshFactory: box ausente para a viga ${beam.id}`);

      const xMin = box.x ? box.x[0] : box.xMin;
      const xMax = box.x ? box.x[1] : box.xMax;
      const yMin = box.y ? box.y[0] : box.yMin;
      const yMax = box.y ? box.y[1] : box.yMax;
      const zMin = box.z ? box.z[0] : box.zMin;
      const zMax = box.z ? box.z[1] : box.zMax;

      const dx = Math.abs(xMax - xMin);
      const dy = Math.abs(yMax - yMin);
      const dz = Math.abs(zMax - zMin);

      const cx = (xMin + xMax) / 2.0;
      const cy = (yMin + yMax) / 2.0;
      const cz = (zMin + zMax) / 2.0;

      const geom = new T.BoxGeometry(dx, dy, dz);
      const mesh = new T.Mesh(geom, concreteMat);
      mesh.position.set(cx, cy, cz);

      const compReal = (beam.eixo === 'X') ? dx : dy;
      mesh.userData = {
        type: 'VIGA',
        id: beam.id,
        secao: `${Math.round(beam.secao.b)}x${Math.round(beam.secao.h)}`,
        b: beam.secao.b,
        h: beam.secao.h,
        eixo: beam.eixo,
        comprimento: compReal,
        comp: compReal,
        trecho: 'Vão Contínuo Executivo',
        desc: `Viga Baldrame ${beam.id} (${beam.secao.b}x${beam.secao.h} cm)`,
        apoios: beam.apoios || [],
        cobrimento: 3.0,
        c_min: 2.5,
        beamData: beam
      };

      const edgesGeom = new T.EdgesGeometry(geom);
      const edges = new T.LineSegments(edgesGeom, edgesMat);
      edges.position.copy(mesh.position);
      edges.userData = {
        type: 'VIGA',
        id: beam.id,
        parentId: beam.id,
        role: 'edges'
      };

      return { mesh, edges };
    }

    /**
     * Instancia todas as malhas 3D de armadura (barras longitudinais e estribos) de uma viga.
     * Utiliza RebarPathBuilder e StirrupPathBuilder para gerar curvas C1 contínuas e tubos 3D.
     *
     * @param {Object} beam - Objeto com dados paramétricos da viga
     * @param {Object} mats - Dicionário de materiais { inf, sup, pele, stirrup }
     * @returns {THREE.Group} Grupo contendo todos os tubos de aço da viga
     */
    static buildBeamRebars(beam, mats) {
      const T = getThree();
      const RebarBuilder = getRebarBuilder();
      const StirrupBuilder = getStirrupBuilder();

      if (!T || !RebarBuilder || !StirrupBuilder) {
        throw new Error('BeamMeshFactory: Dependências geométricas não satisfeitas (Three.js, RebarPathBuilder, StirrupPathBuilder).');
      }

      const group = new T.Group();
      group.userData = { parentId: beam.id, type: 'ARMADURAS_VIGA' };

      const box = {
        orientation: beam.eixo === 'X' ? 'HORIZONTAL' : 'VERTICAL',
        b: beam.secao.b,
        h: beam.secao.h,
        x: beam.box ? beam.box.x : [beam.prismBox.xMin, beam.prismBox.xMax],
        y: beam.box ? beam.box.y : [beam.prismBox.yMin, beam.prismBox.yMax],
        z: beam.box ? beam.box.z : [beam.prismBox.zMin, beam.prismBox.zMax]
      };

      // 1. Barras Longitudinais (Positivas, Negativas, Porta-estribos e Pele)
      const longList = beam.longitudinais || [];
      for (let sIdx = 0; sIdx < longList.length; sIdx++) {
        const bSpec = longList[sIdx];
        const diamMm = Number(bSpec.diamMm || 10.0);
        const rBar = (diamMm / 10.0) / 2.0;
        const role = (bSpec.role || 'inf').toLowerCase();

        // Ganchos verticais calibrados para confinamento estrito
        const d1 = bSpec.d1_confined !== undefined ? bSpec.d1_confined : (bSpec.d1 || 0);
        const d2 = bSpec.d2_confined !== undefined ? bSpec.d2_confined : (bSpec.d2 || 0);

        const offsets = bSpec.lateralOffsets || [0];
        const zLevels = bSpec.zLevels || [bSpec.zLevel];

        // Seleção de material PBR
        let barMat = mats.inf;
        if (role === 'sup' || role === 'negativo') {
          barMat = mats.sup;
        } else if (role === 'pele') {
          barMat = mats.pele;
        }

        for (let zIdx = 0; zIdx < zLevels.length; zIdx++) {
          const zl = zLevels[zIdx];
          for (let oIdx = 0; oIdx < offsets.length; oIdx++) {
            const off = offsets[oIdx];

            let ptStart, ptEnd, dir;
            if (beam.eixo === 'X') {
              ptStart = new T.Vector3(bSpec.xStart, bSpec.yCenter + off, zl);
              ptEnd = new T.Vector3(bSpec.xEnd, bSpec.yCenter + off, zl);
              dir = new T.Vector3(1, 0, 0);
            } else {
              ptStart = new T.Vector3(bSpec.xCenter + off, bSpec.yStart, zl);
              ptEnd = new T.Vector3(bSpec.xCenter + off, bSpec.yEnd, zl);
              dir = new T.Vector3(0, 1, 0);
            }

            const wUp = bSpec.wUp ? new T.Vector3(bSpec.wUp.x, bSpec.wUp.y, bSpec.wUp.z) : undefined;

            const path = RebarBuilder.buildBarPath({
              ptStart,
              ptEnd,
              dir,
              wUp,
              role,
              d1,
              d2,
              diamMm,
              hBeam: beam.secao.h,
              coverNom: 3.0,
              clampHooks: true
            });

            // Resolução de segmentos tubulares balanceada para alto desempenho e suavidade visual
            const tubularSegs = (d1 > 0 && d2 > 0) ? 44 : ((d1 > 0 || d2 > 0) ? 32 : 16);
            const radialSegs = diamMm >= 12.5 ? 8 : 6;

            const geom = new T.TubeGeometry(path, tubularSegs, rBar, radialSegs, false);
            const mesh = new T.Mesh(geom, barMat);

            mesh.userData = {
              type: 'BARRA_LONGITUDINAL',
              parentId: beam.id,
              beamId: beam.id,
              rebarId: bSpec.id,
              mark: bSpec.id,
              diam: diamMm,
              diamMm: diamMm,
              role: role,
              tipo: bSpec.posicao || role,
              posicao: bSpec.posicao || `${role} (Ø${diamMm} mm)`,
              comprimento: bSpec.comprimento || (ptEnd.distanceTo(ptStart) + d1 + d2),
              comp_reto: bSpec.reto || ptEnd.distanceTo(ptStart),
              dobra_esq: d1,
              dobra_dir: d2,
              steelType: 'CA-50',
              cover: 3.0,
              c_nominal: 3.0,
              c_min: 2.5
            };

            group.add(mesh);
          }
        }
      }

      // 2. Estribos Fechados (CA-60)
      const estList = beam.estribos || [];
      for (let eIdx = 0; eIdx < estList.length; eIdx++) {
        const eSpec = estList[eIdx];
        const phiMm = Number(eSpec.diamMm || 5.0);
        const rEst = (phiMm / 10.0) / 2.0;
        const zonas = eSpec.zonas || [];

        for (let zIdx = 0; zIdx < zonas.length; zIdx++) {
          const z = zonas[zIdx];
          const count = Number(z.count || 0);
          const esp = Number(z.espacamento || 20.0);
          const lMin = beam.eixo === 'X' ? box.x[0] : box.y[0];
          const lMax = beam.eixo === 'X' ? box.x[1] : box.y[1];
          let sCurr = lMin + 3.0 + rEst + 2.0;

          for (let i = 0; i < count; i++) {
            if (sCurr > lMax - 3.0 - rEst - 1.0) break;

            const paths = StirrupBuilder.buildStirrupsAtCoord({
              sCoord: sCurr,
              box,
              phiMm,
              coverNom: 3.0
            });

            for (let pIdx = 0; pIdx < paths.length; pIdx++) {
              const p = paths[pIdx];
              const geom = new T.TubeGeometry(p, 32, rEst, 6, true);
              const ringMesh = new T.Mesh(geom, mats.stirrup);

              ringMesh.userData = {
                type: 'ESTRIBO',
                parentId: beam.id,
                beamId: beam.id,
                rebarId: eSpec.id || 'N1',
                mark: eSpec.id || 'N1',
                diam: phiMm,
                diamMm: phiMm,
                role: 'estribo',
                tipo: eSpec.tipo || 'estribo',
                sCoord: sCurr,
                espacamento: esp,
                steelType: 'CA-60',
                cover: 3.0,
                c_nominal: 3.0,
                c_min: 2.5
              };

              group.add(ringMesh);
            }

            sCurr += esp;
          }
        }
      }

      return group;
    }

    /**
     * Constrói todas as 22 vigas baldrames da obra (concreto e aço 3D).
     * Ponto de entrada limpo e modular para a aplicação Three.js.
     *
     * @param {THREE.Scene|THREE.Group|Object} target - Cena, grupo ou contexto
     * @param {Object} [mats] - Materiais customizados opcionais
     * @param {Object} [options] - Opções de configuração:
     *   @param {THREE.Group} [options.concreteGroup] - Grupo para malhas de concreto
     *   @param {THREE.Group} [options.rebarGroup] - Grupo para malhas de armadura
     *   @param {Array<THREE.Object3D>} [options.allObjects] - Lista para raycasting interativo
     *   @param {Object} [options.vigasData] - Objeto VIGAS_DATA (default window.VIGAS_DATA)
     *   @param {Array<THREE.Plane>} [options.clippingPlanes] - Planos de corte
     * @returns {Object} Resumo com referências para os grupos e estatísticas de geração
     */
    static buildAllBeams(target, mats, options = {}) {
      const T = getThree();
      if (!T) {
        throw new Error('BeamMeshFactory: Three.js não encontrado.');
      }

      const vigasData = options.vigasData || (typeof window !== 'undefined' ? window.VIGAS_DATA : null);
      if (!vigasData) {
        throw new Error('BeamMeshFactory: VIGAS_DATA não encontrado.');
      }

      // Resolução ou instanciação dos materiais
      const finalMats = Object.assign(
        this.createDefaultMaterials(options.clippingPlanes || []),
        mats || {}
      );

      // Resolução dos grupos de cena
      let concreteGroup = options.concreteGroup;
      let rebarGroup = options.rebarGroup;
      const allObjects = options.allObjects || null;

      if (!concreteGroup) {
        concreteGroup = new T.Group();
        concreteGroup.name = 'groupConcreteBeams';
        if (target && typeof target.add === 'function') {
          target.add(concreteGroup);
        }
      }

      if (!rebarGroup) {
        rebarGroup = new T.Group();
        rebarGroup.name = 'groupBeamRebars';
        if (target && typeof target.add === 'function') {
          target.add(rebarGroup);
        }
      }

      // Limpeza de malhas pré-existentes
      concreteGroup.clear();
      rebarGroup.clear();

      const beamIds = Object.keys(vigasData)
        .filter(k => k.startsWith('VB'))
        .sort((a, b) => parseInt(a.replace('VB', ''), 10) - parseInt(b.replace('VB', ''), 10));

      const stats = {
        totalBeams: beamIds.length,
        totalConcreteMeshes: 0,
        totalLongitudinalBars: 0,
        totalStirrupRings: 0
      };

      const beamMap = {};

      for (let i = 0; i < beamIds.length; i++) {
        const bId = beamIds[i];
        const beam = vigasData[bId];

        // 1. Fôrma de Concreto + Arestas Destacadas
        const { mesh: concreteMesh, edges: edgeLines } = this.buildBeamFormwork(
          beam,
          finalMats.concrete.clone(),
          finalMats.edges
        );
        concreteGroup.add(concreteMesh);
        concreteGroup.add(edgeLines);
        stats.totalConcreteMeshes++;

        if (allObjects && Array.isArray(allObjects)) {
          allObjects.push(concreteMesh);
        }

        // 2. Gaiola de Armaduras em Tubos 3D (Longitudinais + Estribos)
        const rebarCageGroup = this.buildBeamRebars(beam, finalMats);
        rebarGroup.add(rebarCageGroup);

        // Contabiliza elementos gerados
        rebarCageGroup.children.forEach(c => {
          if (c.userData) {
            if (c.userData.type === 'BARRA_LONGITUDINAL') stats.totalLongitudinalBars++;
            else if (c.userData.type === 'ESTRIBO') stats.totalStirrupRings++;
          }
        });

        beamMap[bId] = {
          concreteMesh,
          edgeLines,
          rebarCageGroup
        };
      }

      return {
        concreteGroup,
        rebarGroup,
        beamMap,
        stats
      };
    }
  }

  return BeamMeshFactory;
}));
