/**
 * StirrupPathBuilder.js
 *
 * Construtor paramétrico de trajetórias 3D para estribos fechados retangulares com cantos
 * em arcos de circunferência exatos a 90° (CircularArcCurve3).
 *
 * Em estrita conformidade com:
 *   - NBR 6118:2023 (Tabela 9.1: raio normativo de dobramento de estribos CA-60 R = 2.0*phi = 1.0 cm)
 *   - Requisito R2: Estribos fechados poligonais com 4 cantos concordados em arcos circulares contínuos C1.
 *   - Requisito R3: Confinamento volumétrico estrito (c >= 2.50 cm) em vigas normais e vigas largas de 40 cm
 *     (estribos duplos sobrepostos de 23 cm de largura em VB4 e VB22).
 *   - Compatibilidade direta com THREE.TubeGeometry(curvePath, 64, rEst, 8, true).
 *
 * Dual export: Browser (window.StirrupPathBuilder) e Node.js (module.exports).
 */

(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['three', './CircularArcCurve3'], factory);
  } else if (typeof module === 'object' && module.exports) {
    let THREE = (typeof root !== 'undefined' && root.THREE) ? root.THREE : null;
    if (!THREE) {
      try {
        THREE = require('three');
      } catch (e) {
        THREE = null;
      }
    }
    let CircularArcCurve3 = null;
    try {
      CircularArcCurve3 = require('./CircularArcCurve3');
    } catch (e) {
      CircularArcCurve3 = (typeof root !== 'undefined') ? root.CircularArcCurve3 : null;
    }
    const exported = factory(THREE, CircularArcCurve3);
    module.exports = exported;
    if (typeof root !== 'undefined') {
      root.StirrupPathBuilder = exported;
    }
  } else {
    root.StirrupPathBuilder = factory(root.THREE, root.CircularArcCurve3);
  }
}(typeof self !== 'undefined' ? self : (typeof global !== 'undefined' ? global : this), function (THREE, CircularArcCurve3Class) {
  'use strict';

  // Fallbacks para execução isolada em Node
  const Vec3 = (THREE && THREE.Vector3) ? THREE.Vector3 : class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
      this.x = Number(x); this.y = Number(y); this.z = Number(z);
    }
    set(x, y, z) { this.x = x; this.y = y; this.z = z; return this; }
    copy(v) { this.x = v.x; this.y = v.y; this.z = v.z; return this; }
    clone() { return new Vec3(this.x, this.y, this.z); }
    add(v) { this.x += v.x; this.y += v.y; this.z += v.z; return this; }
    sub(v) { this.x -= v.x; this.y -= v.y; this.z -= v.z; return this; }
    addScaledVector(v, s) { this.x += v.x * s; this.y += v.y * s; this.z += v.z * s; return this; }
    multiplyScalar(s) { this.x *= s; this.y *= s; this.z *= s; return this; }
    dot(v) { return this.x * v.x + this.y * v.y + this.z * v.z; }
    length() { return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z); }
    distanceTo(v) {
      const dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    normalize() {
      const l = this.length();
      if (l > 1e-12) { this.x /= l; this.y /= l; this.z /= l; }
      else { this.x = 0; this.y = 0; this.z = 0; }
      return this;
    }
    negate() { this.x = -this.x; this.y = -this.y; this.z = -this.z; return this; }
  };

  const BaseCurve = (THREE && THREE.Curve) ? THREE.Curve : class Curve {
    getPoint(t, target) { return target || new Vec3(); }
    getPointAt(u, target) { return this.getPoint(u, target); }
    getTangent(t, target) { return target || new Vec3(); }
    getLength() { return 0; }
    getPoints(div = 5) {
      const pts = [];
      for (let i = 0; i <= div; i++) pts.push(this.getPoint(i / div));
      return pts;
    }
  };

  const LineClass = (THREE && THREE.LineCurve3) ? THREE.LineCurve3 : class LineCurve3 extends BaseCurve {
    constructor(v1, v2) {
      super();
      this.type = 'LineCurve3';
      this.isLineCurve3 = true;
      this.v1 = v1 instanceof Vec3 ? v1.clone() : new Vec3(v1.x, v1.y, v1.z);
      this.v2 = v2 instanceof Vec3 ? v2.clone() : new Vec3(v2.x, v2.y, v2.z);
    }
    getPoint(t, optionalTarget) {
      const pt = optionalTarget || new Vec3();
      if (t === 1) {
        pt.copy(this.v2);
      } else {
        pt.copy(this.v2).sub(this.v1).multiplyScalar(t).add(this.v1);
      }
      return pt;
    }
    getPointAt(u, optionalTarget) {
      return this.getPoint(u, optionalTarget);
    }
    getTangent(t, optionalTarget) {
      const tg = optionalTarget || new Vec3();
      tg.copy(this.v2).sub(this.v1).normalize();
      return tg;
    }
    getLength() {
      return this.v1.distanceTo(this.v2);
    }
    getPoints(divisions = 1) {
      return [this.v1.clone(), this.v2.clone()];
    }
  };

  const PathClass = (THREE && THREE.CurvePath) ? THREE.CurvePath : class CurvePath extends BaseCurve {
    constructor() {
      super();
      this.type = 'CurvePath';
      this.isCurvePath = true;
      this.curves = [];
      this.autoClose = true;
    }
    add(curve) {
      this.curves.push(curve);
    }
    getLength() {
      const lengths = this.getCurveLengths();
      return lengths.length > 0 ? lengths[lengths.length - 1] : 0;
    }
    getCurveLengths() {
      const lengths = [];
      let total = 0;
      for (let i = 0; i < this.curves.length; i++) {
        total += this.curves[i].getLength();
        lengths.push(total);
      }
      return lengths;
    }
    getPoint(t, optionalTarget) {
      const totalLen = this.getLength();
      if (totalLen <= 1e-12 || this.curves.length === 0) {
        return optionalTarget ? optionalTarget.set(0, 0, 0) : new Vec3();
      }
      const targetLen = Math.max(0, Math.min(1, t)) * totalLen;
      const lengths = this.getCurveLengths();
      let prevLen = 0;
      for (let i = 0; i < this.curves.length; i++) {
        const currLen = lengths[i];
        if (targetLen <= currLen || i === this.curves.length - 1) {
          const segLen = currLen - prevLen;
          const localT = segLen > 1e-12 ? Math.max(0, Math.min(1, (targetLen - prevLen) / segLen)) : 0;
          return this.curves[i].getPoint(localT, optionalTarget);
        }
        prevLen = currLen;
      }
      return this.curves[this.curves.length - 1].getPoint(1, optionalTarget);
    }
    getPoints(divisions = 12) {
      const points = [];
      let last = null;
      for (let i = 0; i < this.curves.length; i++) {
        const c = this.curves[i];
        const res = (c.isLineCurve3) ? 1 : divisions;
        const pts = c.getPoints(res);
        for (let j = 0; j < pts.length; j++) {
          const pt = pts[j];
          if (last && last.distanceTo(pt) < 1e-6) continue;
          points.push(pt);
          last = pt;
        }
      }
      return points;
    }
  };

  const CircularArcCurve3 = CircularArcCurve3Class || (typeof window !== 'undefined' ? window.CircularArcCurve3 : null);

  /**
   * Classe StirrupPathBuilder
   */
  class StirrupPathBuilder {
    /**
     * Constrói o CurvePath de um estribo fechado retangular 3D com 4 cantos concordados a 90°.
     *
     * @param {Object} params
     *   @param {THREE.Vector3|Object} params.center - Ponto 3D do centro do anel do estribo (cm)
     *   @param {THREE.Vector3|Object} params.uTrans - Vetor diretor unitário do eixo transversal (largura)
     *   @param {THREE.Vector3|Object} [params.uZ] - Vetor diretor unitário do eixo vertical (altura, default (0,0,1))
     *   @param {number} params.width - Largura de linha de centro do estribo (cm)
     *   @param {number} params.height - Altura de linha de centro do estribo (cm)
     *   @param {number} [params.radius=1.0] - Raio de dobramento dos cantos (cm, default 1.0 cm)
     * @returns {THREE.CurvePath}
     */
    static buildRectangularStirrupPath(params) {
      if (!CircularArcCurve3) {
        throw new Error('StirrupPathBuilder: CircularArcCurve3 não está disponível.');
      }

      const center = params.center instanceof Vec3 ? params.center.clone() : new Vec3(params.center.x, params.center.y, params.center.z);
      const uTrans = params.uTrans instanceof Vec3 ? params.uTrans.clone().normalize() : new Vec3(params.uTrans.x, params.uTrans.y, params.uTrans.z).normalize();
      const uZ = params.uZ ? (params.uZ instanceof Vec3 ? params.uZ.clone().normalize() : new Vec3(params.uZ.x, params.uZ.y, params.uZ.z).normalize()) : new Vec3(0, 0, 1);

      const width = Number(params.width);
      const height = Number(params.height);

      if (width <= 0 || height <= 0) {
        throw new Error(`StirrupPathBuilder: Dimensões inválidas (width=${width}, height=${height}).`);
      }

      const halfW = width / 2.0;
      const halfH = height / 2.0;

      // Raio máximo compatível com as dimensões do anel
      const maxR = Math.min(halfW * 0.9, halfH * 0.9);
      const R = Math.max(0.1, Math.min(Number(params.radius !== undefined ? params.radius : 1.0), maxR));

      // Função de projeção de coordenadas locais (t, z) para o espaço 3D global:
      // P(t, z) = center + t * uTrans + z * uZ
      const pt3D = (t, z) => center.clone().addScaledVector(uTrans, t).addScaledVector(uZ, z);

      const cLeft = -halfW;
      const cRight = halfW;
      const cBot = -halfH;
      const cTop = halfH;

      const path = new PathClass();
      path.autoClose = true;

      // 1. Segmento Reto Inferior (sentido +uTrans)
      // De (cLeft + R, cBot) até (cRight - R, cBot)
      const p1 = pt3D(cLeft + R, cBot);
      const p2 = pt3D(cRight - R, cBot);
      path.add(new LineClass(p1, p2));

      // 2. Canto Inferior Direito (Arco 90°)
      // Centro: (cRight - R, cBot + R)
      // Tangente inicial: +uTrans, Tangente final: +uZ
      // uAxis = -uZ, vAxis = +uTrans
      const center1 = pt3D(cRight - R, cBot + R);
      const arc1 = new CircularArcCurve3(
        center1,
        R,
        uZ.clone().negate(),
        uTrans.clone(),
        0,
        Math.PI / 2
      );
      path.add(arc1);

      // 3. Segmento Reto Lateral Direito (sentido +uZ)
      // De (cRight, cBot + R) até (cRight, cTop - R)
      const p3 = pt3D(cRight, cBot + R);
      const p4 = pt3D(cRight, cTop - R);
      path.add(new LineClass(p3, p4));

      // 4. Canto Superior Direito (Arco 90°)
      // Centro: (cRight - R, cTop - R)
      // Tangente inicial: +uZ, Tangente final: -uTrans
      // uAxis = +uTrans, vAxis = +uZ
      const center2 = pt3D(cRight - R, cTop - R);
      const arc2 = new CircularArcCurve3(
        center2,
        R,
        uTrans.clone(),
        uZ.clone(),
        0,
        Math.PI / 2
      );
      path.add(arc2);

      // 5. Segmento Reto Superior (sentido -uTrans)
      // De (cRight - R, cTop) até (cLeft + R, cTop)
      const p5 = pt3D(cRight - R, cTop);
      const p6 = pt3D(cLeft + R, cTop);
      path.add(new LineClass(p5, p6));

      // 6. Canto Superior Esquerdo (Arco 90°)
      // Centro: (cLeft + R, cTop - R)
      // Tangente inicial: -uTrans, Tangente final: -uZ
      // uAxis = +uZ, vAxis = -uTrans
      const center3 = pt3D(cLeft + R, cTop - R);
      const arc3 = new CircularArcCurve3(
        center3,
        R,
        uZ.clone(),
        uTrans.clone().negate(),
        0,
        Math.PI / 2
      );
      path.add(arc3);

      // 7. Segmento Reto Lateral Esquerdo (sentido -uZ)
      // De (cLeft, cTop - R) até (cLeft, cBot + R)
      const p7 = pt3D(cLeft, cTop - R);
      const p8 = pt3D(cLeft, cBot + R);
      path.add(new LineClass(p7, p8));

      // 8. Canto Inferior Esquerdo (Arco 90°)
      // Centro: (cLeft + R, cBot + R)
      // Tangente inicial: -uZ, Tangente final: +uTrans
      // uAxis = -uTrans, vAxis = -uZ
      // Ponto final fecha exatamente em (cLeft + R, cBot), início do segmento 1!
      const center4 = pt3D(cLeft + R, cBot + R);
      const arc4 = new CircularArcCurve3(
        center4,
        R,
        uTrans.clone().negate(),
        uZ.clone().negate(),
        0,
        Math.PI / 2
      );
      path.add(arc4);

      return path;
    }

    /**
     * Constrói o estribo tridimensional a partir dos limites de uma viga e de sua coordenada longitudinal.
     * Suporta vigas horizontais (X), verticais (Y), estribos simples e duplos sobrepostos.
     *
     * @param {Object} params
     *   @param {number} params.sCoord - Coordenada ao longo do eixo da viga (X para horiz, Y para vert)
     *   @param {Object} params.box - Bounding box da viga com orientation, b, h, x: [xmin, xmax], y: [ymin, ymax], z: [zmin, zmax]
     *   @param {boolean} [params.isDouble=false] - Se é estribo duplo sobreposto (vigas 40 cm)
     *   @param {string} [params.branch='left'] - 'left' | 'right' para ramos do estribo duplo
     *   @param {number} [params.phiMm=5.0] - Bitola do estribo em mm (default 5.0)
     *   @param {number} [params.coverNom=3.0] - Cobrimento nominal em cm (default 3.0)
     * @returns {THREE.CurvePath}
     */
    static buildStirrupForBeam(params) {
      if (!params || params.sCoord === undefined || !params.box) {
        throw new Error('StirrupPathBuilder.buildStirrupForBeam: sCoord e box são obrigatórios.');
      }

      const box = params.box;
      const orient = (box.orientation || 'HORIZONTAL').toUpperCase();
      const sCoord = Number(params.sCoord);
      const phiMm = Number(params.phiMm || 5.0);
      const rEst = (phiMm / 10.0) / 2.0; // cm
      const coverNom = Number(params.coverNom !== undefined ? params.coverNom : 3.0);
      const isDouble = Boolean(params.isDouble || (box.b >= 39.0));
      const branch = (params.branch || 'left').toLowerCase();

      let tMin, tMax;
      let uTrans;
      let center3D;

      if (orient === 'HORIZONTAL') {
        // Eixo longitudinal é X, transversal é Y
        tMin = box.y[0];
        tMax = box.y[1];
        uTrans = new Vec3(0, 1, 0);
      } else {
        // Eixo longitudinal é Y, transversal é X
        tMin = box.x[0];
        tMax = box.x[1];
        uTrans = new Vec3(1, 0, 0);
      }

      const zMin = box.z[0];
      const zMax = box.z[1];

      let cLeft, cRight;
      if (!isDouble) {
        cLeft = tMin + coverNom + rEst;
        cRight = tMax - (coverNom + rEst);
      } else {
        // Estribo duplo de 23 cm de largura nominal para vigas de 40 cm (VB4 e VB22)
        if (branch === 'left') {
          cLeft = tMin + coverNom + rEst;
          cRight = tMin + coverNom + 23.0 - rEst;
        } else {
          cLeft = tMax - (coverNom + 23.0 - rEst);
          cRight = tMax - (coverNom + rEst);
        }
      }

      const cBot = zMin + coverNom + rEst;
      const cTop = zMax - (coverNom + rEst);

      const width = cRight - cLeft;
      const height = cTop - cBot;
      const tCenter = (cLeft + cRight) / 2.0;
      const zCenter = (cBot + cTop) / 2.0;

      if (orient === 'HORIZONTAL') {
        center3D = new Vec3(sCoord, tCenter, zCenter);
      } else {
        center3D = new Vec3(tCenter, sCoord, zCenter);
      }

      // Raio normativo NBR 6118 para estribos CA-60 (R = 2.0 * phi = 1.0 cm)
      const R_corner = CircularArcCurve3.getBendingRadius(phiMm, 'stirrup');

      return this.buildRectangularStirrupPath({
        center: center3D,
        uTrans: uTrans,
        uZ: new Vec3(0, 0, 1),
        width: width,
        height: height,
        radius: R_corner
      });
    }

    /**
     * Constrói todos os anéis de estribo na coordenada longitudinal dada.
     * Retorna 1 CurvePath para vigas comuns ou 2 CurvePaths (esquerdo e direito) para vigas de 40 cm.
     *
     * @param {Object} params - Mesmos parâmetros de buildStirrupForBeam
     * @returns {Array<THREE.CurvePath>}
     */
    static buildStirrupsAtCoord(params) {
      const box = params.box;
      const isDouble = Boolean(params.isDouble || (box && box.b >= 39.0));

      if (!isDouble) {
        return [this.buildStirrupForBeam({ ...params, isDouble: false })];
      }

      const left = this.buildStirrupForBeam({ ...params, isDouble: true, branch: 'left' });
      const right = this.buildStirrupForBeam({ ...params, isDouble: true, branch: 'right' });
      return [left, right];
    }

    /**
     * Amostra pontos 3D ao longo de um CurvePath fechado de estribo.
     * @param {THREE.CurvePath} curvePath
     * @param {number} [step=2.0]
     * @returns {Array<THREE.Vector3>}
     */
    static samplePoints(curvePath, step = 2.0) {
      if (!curvePath || !curvePath.curves) return [];
      const allPts = [];

      for (let cIdx = 0; cIdx < curvePath.curves.length; cIdx++) {
        const c = curvePath.curves[cIdx];
        const len = c.getLength ? c.getLength() : 0;
        const nSamples = Math.max(2, Math.ceil(len / step) + 1);

        for (let i = 0; i < nSamples; i++) {
          const t = i / (nSamples - 1);
          const pt = c.getPoint(t);
          if (allPts.length > 0) {
            const last = allPts[allPts.length - 1];
            if (last.distanceTo(pt) < 1e-5) continue;
          }
          allPts.push(pt);
        }
      }

      // Adiciona o ponto de fechamento exato se houver gap
      if (allPts.length > 0) {
        const first = allPts[0];
        const last = allPts[allPts.length - 1];
        if (last.distanceTo(first) > 1e-6) {
          allPts.push(first.clone());
        }
      }

      return allPts;
    }

    /**
     * Verifica formalmente a continuidade C0, C1 e o fechamento do anel do estribo.
     * @param {THREE.CurvePath} curvePath
     * @param {number} [epsilon=1e-4]
     * @returns {Object}
     */
    static verifyStirrupClosureAndC1(curvePath, epsilon = 1e-4) {
      if (!curvePath || !curvePath.curves || curvePath.curves.length !== 8) {
        return {
          valid: false,
          error: `Esperado 8 curvas no anel (4 retas + 4 arcos), obtido ${curvePath ? curvePath.curves.length : 0}`
        };
      }

      let maxDiscontinuity = 0;
      let minTangentAlignment = 1.0;
      let isC0 = true;
      let isC1 = true;
      const junctions = [];

      const n = curvePath.curves.length;
      for (let i = 0; i < n; i++) {
        const nextIdx = (i + 1) % n;
        const cCurr = curvePath.curves[i];
        const cNext = curvePath.curves[nextIdx];

        const pEnd = cCurr.getPoint(1);
        const pStart = cNext.getPoint(0);
        const gap = pEnd.distanceTo(pStart);

        const tEnd = cCurr.getTangent(1).normalize();
        const tStart = cNext.getTangent(0).normalize();
        const dot = tEnd.dot(tStart);

        maxDiscontinuity = Math.max(maxDiscontinuity, gap);
        minTangentAlignment = Math.min(minTangentAlignment, dot);

        if (gap > epsilon) isC0 = false;
        if (dot < 1.0 - epsilon) isC1 = false;

        junctions.push({
          fromIndex: i,
          toIndex: nextIdx,
          gap,
          tangentDot: dot
        });
      }

      return {
        valid: isC0 && isC1,
        isC0,
        isC1,
        maxDiscontinuity,
        minTangentAlignment,
        junctions
      };
    }
  }

  return StirrupPathBuilder;
}));
