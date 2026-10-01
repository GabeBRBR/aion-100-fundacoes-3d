/**
 * ContainmentValidator.js
 *
 * Módulo paramétrico de validação volumétrica e confinamento de armaduras
 * para as vigas baldrames da obra AION-100 (VB1 a VB22).
 *
 * Em estrita conformidade com:
 *   - NBR 6118:2023 (Item 7.4.7: cobrimento nominal c_nom = 3.0 cm, mínimo c_min = 2.5 cm)
 *   - Requisito R3: Confinamento rigoroso sem extrapolação em qualquer das 6 faces de concreto.
 *   - Requisito R4: Verificação matemática automatizada por inequações de erosão de Minkowski.
 *   - Feature F5: Clamping paramétrico de ganchos verticais e recuo transversal das barras de canto.
 *
 * Dual export: Browser (window.ContainmentValidator) e Node.js (module.exports).
 */

(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['three', './RebarPathBuilder', './StirrupPathBuilder'], factory);
  } else if (typeof module === 'object' && module.exports) {
    let THREE = (typeof root !== 'undefined' && root.THREE) ? root.THREE : null;
    if (!THREE) {
      try { THREE = require('three'); } catch (e) { THREE = null; }
    }
    let RebarPathBuilder = null;
    let StirrupPathBuilder = null;
    try { RebarPathBuilder = require('./RebarPathBuilder'); } catch (e) {
      RebarPathBuilder = (typeof root !== 'undefined') ? root.RebarPathBuilder : null;
    }
    try { StirrupPathBuilder = require('./StirrupPathBuilder'); } catch (e) {
      StirrupPathBuilder = (typeof root !== 'undefined') ? root.StirrupPathBuilder : null;
    }
    const exported = factory(THREE, RebarPathBuilder, StirrupPathBuilder);
    module.exports = exported;
    if (typeof root !== 'undefined') {
      root.ContainmentValidator = exported;
    }
  } else {
    root.ContainmentValidator = factory(root.THREE, root.RebarPathBuilder, root.StirrupPathBuilder);
  }
}(typeof self !== 'undefined' ? self : (typeof global !== 'undefined' ? global : this), function (THREE, RebarPathBuilderClass, StirrupPathBuilderClass) {
  'use strict';

  // Constantes Normativas e de Validação
  const COVER_MIN_CM = 2.50;      // Cobrimento mínimo normativo NBR 6118 (c >= 2.50 cm)
  const COVER_NOM_CM = 3.00;      // Cobrimento nominal de projeto
  const EPSILON_CM   = 1e-4;      // Tolerância estrita de ponto flutuante (0.001 mm)
  const TOP_ELEVATION_CM = -10.0; // Cota de topo unificada

  /**
   * Converte ponto para coordenadas numéricas {x, y, z}.
   */
  function extractCoords(p) {
    if (!p) return { x: 0, y: 0, z: 0 };
    if (Array.isArray(p)) return { x: Number(p[0]) || 0, y: Number(p[1]) || 0, z: Number(p[2]) || 0 };
    return { x: Number(p.x) || 0, y: Number(p.y) || 0, z: Number(p.z) || 0 };
  }

  /**
   * Normaliza a estrutura de caixa delimitadora (bounding box).
   */
  function normalizeBox(box) {
    if (!box) {
      throw new Error('ContainmentValidator: box é obrigatório.');
    }
    let xMin, xMax, yMin, yMax, zMin, zMax;

    if (box.x && Array.isArray(box.x)) {
      xMin = Number(box.x[0]);
      xMax = Number(box.x[1]);
    } else if (box.xMin !== undefined && box.xMax !== undefined) {
      xMin = Number(box.xMin);
      xMax = Number(box.xMax);
    } else {
      throw new Error('ContainmentValidator: limites no eixo X não encontrados no box.');
    }

    if (box.y && Array.isArray(box.y)) {
      yMin = Number(box.y[0]);
      yMax = Number(box.y[1]);
    } else if (box.yMin !== undefined && box.yMax !== undefined) {
      yMin = Number(box.yMin);
      yMax = Number(box.yMax);
    } else {
      throw new Error('ContainmentValidator: limites no eixo Y não encontrados no box.');
    }

    if (box.z && Array.isArray(box.z)) {
      zMin = Number(box.z[0]);
      zMax = Number(box.z[1]);
    } else if (box.zMin !== undefined && box.zMax !== undefined) {
      zMin = Number(box.zMin);
      zMax = Number(box.zMax);
    } else {
      throw new Error('ContainmentValidator: limites no eixo Z não encontrados no box.');
    }

    const b = box.b !== undefined ? Number(box.b) : Math.min(xMax - xMin, yMax - yMin);
    const h = box.h !== undefined ? Number(box.h) : (zMax - zMin);
    const orientation = box.orientation || ((xMax - xMin) >= (yMax - yMin) ? 'HORIZONTAL' : 'VERTICAL');

    return {
      x: [xMin, xMax],
      y: [yMin, yMax],
      z: [zMin, zMax],
      xMin, xMax, yMin, yMax, zMin, zMax,
      b, h,
      orientation
    };
  }

  /**
   * Classe ContainmentValidator
   */
  class ContainmentValidator {
    static get COVER_MIN_CM() { return COVER_MIN_CM; }
    static get COVER_NOM_CM() { return COVER_NOM_CM; }
    static get EPSILON_CM() { return EPSILON_CM; }
    static get TOP_ELEVATION_CM() { return TOP_ELEVATION_CM; }

    /**
     * Calcula o bounding box do núcleo de concreto erodido pela erosão de Minkowski:
     *   Omega_erodido = Omega_concreto - (cobrimento + raio_da_barra)
     *
     * @param {Object} box - Caixa delimitadora do concreto da viga
     * @param {number} [coverMin=2.50] - Cobrimento mínimo normativo (cm)
     * @param {number} [rBar=0.0] - Raio físico da barra de armadura (cm)
     * @returns {Object} { xMin, xMax, yMin, yMax, zMin, zMax, bEroded, hEroded, isValid }
     */
    static computeErodedCoreBox(box, coverMin = COVER_MIN_CM, rBar = 0.0) {
      const b = normalizeBox(box);
      const totalMargin = Number(coverMin) + Number(rBar);

      const xMin = b.x[0] + totalMargin;
      const xMax = b.x[1] - totalMargin;
      const yMin = b.y[0] + totalMargin;
      const yMax = b.y[1] - totalMargin;
      const zMin = b.z[0] + totalMargin;
      const zMax = b.z[1] - totalMargin;

      const isValid = (xMax >= xMin) && (yMax >= yMin) && (zMax >= zMin);

      return {
        x: [xMin, xMax],
        y: [yMin, yMax],
        z: [zMin, zMax],
        xMin, xMax, yMin, yMax, zMin, zMax,
        bEroded: Math.max(0, yMax - yMin),
        hEroded: Math.max(0, zMax - zMin),
        isValid
      };
    }

    /**
     * Clamping paramétrico de abas verticais de ancoragem / ganchos:
     * Garante que a ponta do gancho permaneça rigorosamente confinada dentro do prisma da viga.
     *   dMax = h - 6.0 - 2 * rBar (conforme NBR 6118 / R3 / F5)
     *
     * @param {number} nominalD - Comprimento nominal de projeto da dobra (cm)
     * @param {number} hBeam - Altura total da viga de concreto (cm)
     * @param {number} rBar - Raio físico da barra em cm (phi/20)
     * @param {number} [coverNom=3.0] - Cobrimento nominal em cm
     * @param {number} [phiEstMm=5.0] - Bitola do estribo em mm
     * @returns {number} Comprimento clamped seguro (cm)
     */
    static clampVerticalHook(nominalD, hBeam, rBar = 0.5, coverNom = COVER_NOM_CM, phiEstMm = 5.0) {
      const dNom = Math.max(0, Number(nominalD) || 0);
      if (dNom <= 0) return 0.0;

      const h = Number(hBeam) || 30.0;
      const r = Number(rBar) || 0.5;
      const c = Number(coverNom) || 3.0;
      const rEst = (Number(phiEstMm) || 5.0) / 20.0;

      const dMax = Math.max(5.0, h - 2.0 * c - 2.0 * rEst - 2.0 * r);
      return Math.min(dNom, dMax);
    }

    /**
     * Calcula o recuo transversal paramétrico da linha de centro da barra de canto:
     *   yLong = b/2 - 3.0 - rBar (assegura cobrimento >= 2.50 cm e folga com estribos)
     *
     * @param {number} bBeam - Largura da viga (cm)
     * @param {number} rBar - Raio da barra (cm)
     * @param {number} [coverNom=3.0] - Cobrimento nominal (cm)
     * @param {number} [phiEstMm=5.0] - Bitola do estribo (mm)
     * @returns {number} Offset transversal a partir do eixo central da viga (cm)
     */
    static computeCornerBarOffset(bBeam, rBar = 0.5, coverNom = COVER_NOM_CM, phiEstMm = 5.0) {
      const b = Number(bBeam) || 20.0;
      const r = Number(rBar) || 0.5;
      const c = Number(coverNom) || 3.0;
      const phiEstCm = (Number(phiEstMm) || 5.0) / 10.0;

      return (b / 2.0) - c - phiEstCm - r;
    }

    /**
     * Avalia o confinamento volumétrico para um único ponto 3D contra as 6 faces da fôrma:
     *   distâncias às faces: dx1, dx2, dy1, dy2, dz1, dz2
     *   cobrimento livre = min(distâncias) - rBar
     *
     * @param {THREE.Vector3|Object|Array} point
     * @param {number} rBar - Raio físico da barra em cm
     * @param {Object} box - Bounding box da viga
     * @param {number} [coverMin=2.50] - Cobrimento mínimo exigido
     * @param {number} [epsilon=1e-4] - Tolerância numérica
     * @returns {Object} { cover, violationDepth, isViolated, margins: {dx1, dx2, dy1, dy2, dz1, dz2} }
     */
    static checkPointContainment(point, rBar = 0.0, box, coverMin = COVER_MIN_CM, epsilon = EPSILON_CM) {
      const b = normalizeBox(box);
      const p = extractCoords(point);
      const r = Number(rBar) || 0.0;
      const cMin = Number(coverMin);
      const eps = Number(epsilon);

      const dx1 = p.x - (b.x[0] + r);
      const dx2 = (b.x[1] - r) - p.x;
      const dy1 = p.y - (b.y[0] + r);
      const dy2 = (b.y[1] - r) - p.y;
      const dz1 = p.z - (b.z[0] + r);
      const dz2 = (b.z[1] - r) - p.z;

      const cover = Math.min(dx1, dx2, dy1, dy2, dz1, dz2);
      const violationDepth = Math.max(0.0, cMin - cover);
      const isViolated = cover < (cMin - eps);

      return {
        cover,
        violationDepth,
        isViolated,
        margins: { dx1, dx2, dy1, dy2, dz1, dz2 }
      };
    }

    /**
     * Avalia o confinamento volumétrico de uma coleção de pontos 3D amostrados ao longo de uma barra ou estribo.
     * Retorna estatísticas completas e lista de violações encontradas.
     *
     * @param {Array<THREE.Vector3|Object>} points - Lista de pontos 3D
     * @param {number} rBar - Raio físico da barra/estribo (cm)
     * @param {Object} box - Bounding box da viga
     * @param {number} [coverMin=2.50]
     * @param {number} [epsilon=1e-4]
     * @returns {Object} { minCover, maxViolation, violationsCount, totalPoints, status, violations }
     */
    static checkContainment(points, rBar = 0.0, box, coverMin = COVER_MIN_CM, epsilon = EPSILON_CM) {
      if (!points || points.length === 0) {
        return {
          minCover: 999.0,
          maxViolation: 0.0,
          violationsCount: 0,
          totalPoints: 0,
          status: 'PASS',
          violations: []
        };
      }

      let minCover = 999.0;
      let maxViolation = 0.0;
      let violationsCount = 0;
      const violations = [];

      for (let i = 0; i < points.length; i++) {
        const res = this.checkPointContainment(points[i], rBar, box, coverMin, epsilon);
        if (res.cover < minCover) minCover = res.cover;
        if (res.violationDepth > maxViolation) maxViolation = res.violationDepth;
        if (res.isViolated) {
          violationsCount++;
          if (violations.length < 20) {
            violations.push({
              index: i,
              point: extractCoords(points[i]),
              cover: res.cover,
              violationDepth: res.violationDepth,
              margins: res.margins
            });
          }
        }
      }

      return {
        minCover,
        maxViolation,
        violationsCount,
        totalPoints: points.length,
        status: violationsCount === 0 ? 'PASS' : 'FAIL',
        violations
      };
    }

    /**
     * Amostra densamente pontos 3D ao longo de um THREE.CurvePath.
     *
     * @param {THREE.CurvePath|Object} curvePath
     * @param {number} [step=2.0] - Passo máximo de amostragem em cm
     * @returns {Array<{x: number, y: number, z: number}>}
     */
    static sampleCurvePath(curvePath, step = 2.0) {
      if (!curvePath) return [];
      if (RebarPathBuilderClass && typeof RebarPathBuilderClass.samplePoints === 'function') {
        return RebarPathBuilderClass.samplePoints(curvePath, step);
      }
      if (StirrupPathBuilderClass && typeof StirrupPathBuilderClass.samplePoints === 'function') {
        return StirrupPathBuilderClass.samplePoints(curvePath, step);
      }

      // Amostrador nativo caso as classes auxiliares não estejam vinculadas
      if (curvePath.curves && Array.isArray(curvePath.curves)) {
        const allPts = [];
        for (let cIdx = 0; cIdx < curvePath.curves.length; cIdx++) {
          const c = curvePath.curves[cIdx];
          const len = c.getLength ? c.getLength() : 10.0;
          const nSamples = Math.max(2, Math.ceil(len / step) + 1);
          for (let i = 0; i < nSamples; i++) {
            const t = i / (nSamples - 1);
            const pt = c.getPoint(t);
            allPts.push(extractCoords(pt));
          }
        }
        return allPts;
      }

      if (typeof curvePath.getPoints === 'function') {
        return curvePath.getPoints(50).map(extractCoords);
      }

      return [];
    }

    /**
     * Valida formalmente um CurvePath de armadura longitudinal.
     *
     * @param {THREE.CurvePath} curvePath
     * @param {number} diamMm - Bitola nominal da barra em mm
     * @param {Object} box - Caixa delimitadora do concreto
     * @param {number} [coverMin=2.50]
     * @param {number} [step=2.0]
     * @returns {Object} Resultado detalhado de validação
     */
    static validateRebarCurvePath(curvePath, diamMm, box, coverMin = COVER_MIN_CM, step = 2.0) {
      const rBar = (Number(diamMm || 10.0) / 10.0) / 2.0;
      const pts = this.sampleCurvePath(curvePath, step);
      return this.checkContainment(pts, rBar, box, coverMin);
    }

    /**
     * Valida formalmente um CurvePath de estribo fechado.
     *
     * @param {THREE.CurvePath} curvePath
     * @param {number} [phiMm=5.0] - Bitola do estribo em mm
     * @param {Object} box - Caixa delimitadora do concreto
     * @param {number} [coverMin=2.50]
     * @param {number} [step=2.0]
     * @returns {Object} Resultado detalhado de validação
     */
    static validateStirrupCurvePath(curvePath, phiMm = 5.0, box, coverMin = COVER_MIN_CM, step = 2.0) {
      const rEst = (Number(phiMm) / 10.0) / 2.0;
      const pts = this.sampleCurvePath(curvePath, step);
      return this.checkContainment(pts, rEst, box, coverMin);
    }

    /**
     * Valida todas as barras longitudinais e estribos de uma viga baldrame a partir de sua especificação paramétrica.
     * Totalmente alinhado aos resultados de validate_beam_rebar_containment.py.
     *
     * @param {Object} beamData - Dados da viga (de VIGAS_DATA ou master_beams_verified.json)
     * @param {Object} [options={}] - { step: 2.0, coverMin: 2.50 }
     * @returns {Object} Relatório estruturado de conformidade volumétrica da viga
     */
    static validateBeam(beamData, options = {}) {
      if (!beamData) {
        throw new Error('ContainmentValidator.validateBeam: beamData é obrigatório.');
      }

      const step = Number(options.step || 2.0);
      const coverMin = Number(options.coverMin || COVER_MIN_CM);
      const box = normalizeBox(beamData.box || beamData.prismBox);
      const beamId = beamData.id || 'VB?';

      const results = {
        id: beamId,
        section: `${intVal(box.b)}x${intVal(box.h)}`,
        orientation: box.orientation,
        boundingBox: box,
        totalBarsChecked: 0,
        totalStirrupsChecked: 0,
        totalPointsSampled: 0,
        minCoverAchievedCm: 999.0,
        maxViolationDepthCm: 0.0,
        violationsCount: 0,
        status: 'PASS',
        elements: []
      };

      const RebarBuilder = RebarPathBuilderClass || (typeof window !== 'undefined' ? window.RebarPathBuilder : null);
      const StirrupBuilder = StirrupPathBuilderClass || (typeof window !== 'undefined' ? window.StirrupPathBuilder : null);

      if (!RebarBuilder || !StirrupBuilder) {
        throw new Error('ContainmentValidator: RebarPathBuilder e StirrupPathBuilder devem estar disponíveis.');
      }

      // 1. Armaduras Longitudinais
      const longList = beamData.longitudinais || [];
      for (let sIdx = 0; sIdx < longList.length; sIdx++) {
        const bSpec = longList[sIdx];
        const diamMm = Number(bSpec.diamMm || 10.0);
        const rBar = (diamMm / 10.0) / 2.0;
        const role = bSpec.role || 'inf';
        const d1 = bSpec.d1_confined !== undefined ? bSpec.d1_confined : (bSpec.d1 || 0);
        const d2 = bSpec.d2_confined !== undefined ? bSpec.d2_confined : (bSpec.d2 || 0);
        const offsets = bSpec.lateralOffsets || [0];
        const zLevels = bSpec.zLevels || [bSpec.zLevel];

        for (const zl of zLevels) {
          for (const off of offsets) {
            let ptStart, ptEnd;
            if (box.orientation === 'HORIZONTAL') {
              const xS = bSpec.xStart !== undefined ? bSpec.xStart : (box.x[0] + COVER_NOM_CM + rBar);
              const xE = bSpec.xEnd !== undefined ? bSpec.xEnd : (box.x[1] - COVER_NOM_CM - rBar);
              const yC = bSpec.yCenter !== undefined ? bSpec.yCenter : ((box.y[0] + box.y[1]) / 2.0);
              ptStart = { x: xS, y: yC + off, z: zl };
              ptEnd = { x: xE, y: yC + off, z: zl };
            } else {
              const yS = bSpec.yStart !== undefined ? bSpec.yStart : (box.y[0] + COVER_NOM_CM + rBar);
              const yE = bSpec.yEnd !== undefined ? bSpec.yEnd : (box.y[1] - COVER_NOM_CM - rBar);
              const xC = bSpec.xCenter !== undefined ? bSpec.xCenter : ((box.x[0] + box.x[1]) / 2.0);
              ptStart = { x: xC + off, y: yS, z: zl };
              ptEnd = { x: xC + off, y: yE, z: zl };
            }

            const path = RebarBuilder.buildBarPath({
              ptStart,
              ptEnd,
              role,
              d1,
              d2,
              diamMm,
              hBeam: box.h
            });

            const pts = RebarBuilder.samplePoints(path, step);
            const chk = this.checkContainment(pts, rBar, box, coverMin);

            results.totalBarsChecked++;
            results.totalPointsSampled += chk.totalPoints;
            results.violationsCount += chk.violationsCount;
            if (chk.minCover < results.minCoverAchievedCm) results.minCoverAchievedCm = chk.minCover;
            if (chk.maxViolation > results.maxViolationDepthCm) results.maxViolationDepthCm = chk.maxViolation;

            results.elements.push({
              type: 'LONGITUDINAL',
              id: bSpec.id,
              role,
              diamMm,
              d1, d2,
              minCover: chk.minCover,
              violations: chk.violationsCount
            });
          }
        }
      }

      // 2. Estribos
      const estList = beamData.estribos || [];
      for (let eIdx = 0; eIdx < estList.length; eIdx++) {
        const eSpec = estList[eIdx];
        const phiMm = Number(eSpec.diamMm || 5.0);
        const rEst = (phiMm / 10.0) / 2.0;
        const zonas = eSpec.zonas || [];

        for (const z of zonas) {
          const count = Number(z.count || 0);
          const esp = Number(z.espacamento || 20.0);
          const lMin = box.orientation === 'HORIZONTAL' ? box.x[0] : box.y[0];
          const lMax = box.orientation === 'HORIZONTAL' ? box.x[1] : box.y[1];
          let sCurr = lMin + COVER_NOM_CM + rEst + 2.0;

          for (let i = 0; i < count; i++) {
            if (sCurr > lMax - COVER_NOM_CM - rEst - 1.0) break;

            const paths = StirrupBuilder.buildStirrupsAtCoord({
              sCoord: sCurr,
              box,
              phiMm
            });

            for (const p of paths) {
              results.totalStirrupsChecked++;
              const pts = StirrupBuilder.samplePoints(p, step);
              const chk = this.checkContainment(pts, rEst, box, coverMin);

              results.totalPointsSampled += chk.totalPoints;
              results.violationsCount += chk.violationsCount;
              if (chk.minCover < results.minCoverAchievedCm) results.minCoverAchievedCm = chk.minCover;
              if (chk.maxViolation > results.maxViolationDepthCm) results.maxViolationDepthCm = chk.maxViolation;
            }
            sCurr += esp;
          }
        }
      }

      results.status = results.violationsCount === 0 ? 'PASS' : 'FAIL';
      return results;
    }

    /**
     * Executa a auditoria completa de confinamento em todas as 22 vigas baldrames.
     *
     * @param {Object} vigasData - Objeto contendo { VB1: {...}, ..., VB22: {...} }
     * @param {Object} [options={}] - { step: 2.0, verbose: false }
     * @returns {Object} Relatório global de auditoria
     */
    static validateAllBeams(vigasData, options = {}) {
      const data = vigasData || (typeof window !== 'undefined' ? window.VIGAS_DATA : null);
      if (!data) {
        throw new Error('ContainmentValidator.validateAllBeams: dados de vigas não encontrados.');
      }

      const beamIds = Object.keys(data)
        .filter(k => k.startsWith('VB'))
        .sort((a, b) => parseInt(a.replace('VB', ''), 10) - parseInt(b.replace('VB', ''), 10));

      const report = {
        summary: {
          totalBeamsChecked: beamIds.length,
          totalBarsChecked: 0,
          totalStirrupsChecked: 0,
          totalPointsSampled: 0,
          minCoverAchievedCm: 999.0,
          maxViolationDepthCm: 0.0,
          totalViolations: 0,
          globalStatus: 'PASS',
          timestamp: new Date().toISOString()
        },
        beams: []
      };

      for (const bId of beamIds) {
        const bRes = this.validateBeam(data[bId], options);
        report.beams.push(bRes);
        report.summary.totalBarsChecked += bRes.totalBarsChecked;
        report.summary.totalStirrupsChecked += bRes.totalStirrupsChecked;
        report.summary.totalPointsSampled += bRes.totalPointsSampled;
        report.summary.totalViolations += bRes.violationsCount;
        if (bRes.minCoverAchievedCm < report.summary.minCoverAchievedCm) {
          report.summary.minCoverAchievedCm = bRes.minCoverAchievedCm;
        }
        if (bRes.maxViolationDepthCm > report.summary.maxViolationDepthCm) {
          report.summary.maxViolationDepthCm = bRes.maxViolationDepthCm;
        }
      }

      if (report.summary.totalViolations > 0) {
        report.summary.globalStatus = 'FAIL';
      }

      return report;
    }
  }

  function intVal(v) {
    return Math.round(Number(v) || 0);
  }

  return ContainmentValidator;
}));
