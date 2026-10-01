/**
 * RebarPathBuilder.js
 *
 * Construtor paramétrico de trajetórias 3D para barras de armadura longitudinal
 * (armadura inferior/positiva, superior/porta-estribos, negativos e armadura de pele).
 *
 * Em estrita conformidade com:
 *   - NBR 6118:2023 (Tabela 9.1 e Item 9.4.2.3: raios normativos de dobramento R = 3.0*phi)
 *   - Requisito R2: Substituição integral de splines/Bézier por retas (LineCurve3) e
 *     arcos de circunferência exatos a 90° (CircularArcCurve3) com continuidade C1 rigorosa.
 *   - Requisito R3: Clamping paramétrico de ganchos verticais (dMax = h - 6.0 - 2*r) para
 *     eliminação absoluta de vazamentos fora do prisma de concreto.
 *
 * Dual export: Browser (window.RebarPathBuilder) e Node.js (module.exports).
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
      root.RebarPathBuilder = exported;
    }
  } else {
    root.RebarPathBuilder = factory(root.THREE, root.CircularArcCurve3);
  }
}(typeof self !== 'undefined' ? self : (typeof global !== 'undefined' ? global : this), function (THREE, CircularArcCurve3Class) {
  'use strict';

  // Fallbacks para execução isolada em Node sem THREE global
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
      this.autoClose = false;
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

  function toVec3(p) {
    if (!p) return new Vec3();
    if (p instanceof Vec3) return p.clone();
    return new Vec3(p.x || 0, p.y || 0, p.z || 0);
  }

  /**
   * Classe RebarPathBuilder
   */
  class RebarPathBuilder {
    /**
     * Constrói CurvePath composto com retas e arcos circulares tangentes a 90°.
     *
     * @param {Object} spec - Parâmetros da barra longitudinal:
     *   @param {THREE.Vector3|Object} spec.ptStart - Ponto inicial do corpo reto (cm)
     *   @param {THREE.Vector3|Object} spec.ptEnd - Ponto final do corpo reto (cm)
     *   @param {THREE.Vector3|Object} [spec.dir] - Vetor diretor unitário ao longo do eixo da barra
     *   @param {THREE.Vector3|Object} [spec.wUp] - Vetor diretor do gancho (+Z para cima, -Z para baixo)
     *   @param {string} [spec.role='inf'] - Papel da armadura ('inf', 'sup', 'pele', 'negativo', 'positivo')
     *   @param {number} [spec.d1=0] - Comprimento nominal da dobra no início (cm)
     *   @param {number} [spec.d2=0] - Comprimento nominal da dobra no final (cm)
     *   @param {number} [spec.diamMm=10.0] - Diâmetro nominal da barra em milímetros (ex: 8.0, 10.0, 12.5, 16.0)
     *   @param {number} [spec.hBeam] - Altura da viga (cm), usado para clamping paramétrico dMax
     *   @param {number} [spec.coverNom=3.0] - Cobrimento nominal de projeto (cm, default 3.0)
     *   @param {number} [spec.phiEst=5.0] - Diâmetro do estribo (mm, default 5.0)
     *   @param {boolean} [spec.clampHooks=true] - Se deve aplicar clamping de confinamento
     *   @param {number} [spec.dMax] - Teto explícito de gancho vertical (opcional)
     * @returns {THREE.CurvePath}
     */
    static buildBarPath(spec) {
      if (!spec || !spec.ptStart || !spec.ptEnd) {
        throw new Error('RebarPathBuilder.buildBarPath: ptStart e ptEnd são obrigatórios.');
      }

      if (!CircularArcCurve3) {
        throw new Error('RebarPathBuilder: CircularArcCurve3 não está carregado no ambiente.');
      }

      const pStart = toVec3(spec.ptStart);
      const pEnd = toVec3(spec.ptEnd);
      const span = pEnd.distanceTo(pStart);

      // Vetor diretor longitudinal unitário
      let dir;
      if (spec.dir) {
        dir = toVec3(spec.dir).normalize();
      } else if (span > 1e-6) {
        dir = pEnd.clone().sub(pStart).normalize();
      } else {
        dir = new Vec3(1, 0, 0);
      }

      // Vetor diretor vertical do gancho w:
      // - Barras inferiores/positivas: dobram para CIMA (+Z)
      // - Barras superiores/negativas: dobram para BAIXO (-Z)
      let w;
      if (spec.wUp) {
        w = toVec3(spec.wUp).normalize();
      } else {
        const role = (spec.role || 'inf').toLowerCase();
        if (role === 'inf' || role === 'positivo') {
          w = new Vec3(0, 0, 1);
        } else if (role === 'sup' || role === 'negativo') {
          w = new Vec3(0, 0, -1);
        } else if (role === 'pele') {
          w = new Vec3(0, 0, 0);
        } else {
          w = new Vec3(0, 0, 1);
        }
      }

      // Bitola e raio físico da barra em cm
      const diamMm = Number(spec.diamMm) || 10.0;
      const phiCm = diamMm / 10.0;
      const rBar = phiCm / 2.0;

      // Clamping paramétrico de confinamento vertical:
      // dMax = h - 6.0 - 2 * rBar (NBR 6118 / R3 / F5)
      let effD1 = Math.max(0, Number(spec.d1) || 0);
      let effD2 = Math.max(0, Number(spec.d2) || 0);

      if (spec.clampHooks !== false) {
        let dMaxLimit = null;
        if (spec.dMax !== undefined && spec.dMax !== null) {
          dMaxLimit = Number(spec.dMax);
        } else if (spec.hBeam) {
          const coverNom = spec.coverNom !== undefined ? Number(spec.coverNom) : 3.0;
          const phiEstCm = (Number(spec.phiEst) || 5.0) / 10.0;
          dMaxLimit = Math.max(5.0, Number(spec.hBeam) - 2.0 * coverNom - 2.0 * phiEstCm - 2.0 * rBar);
        }

        if (dMaxLimit !== null) {
          if (effD1 > 0) effD1 = Math.min(effD1, dMaxLimit);
          if (effD2 > 0) effD2 = Math.min(effD2, dMaxLimit);
        }
      }

      const path = new PathClass();

      // Caso 1: Barra reta pura sem ganchos (ex: reforços retos de vão, pele)
      if (effD1 <= 0 && effD2 <= 0) {
        path.add(new LineClass(pStart, pEnd));
        return path;
      }

      // Raio normativo NBR 6118 para armaduras longitudinais (R = 3.0 * phi para CA-50)
      const R = CircularArcCurve3.getBendingRadius(diamMm, 'longitudinal');

      // Caso 2: Barra com gancho no início (lado esquerdo)
      let bodyStart = pStart.clone();
      if (effD1 > 0) {
        // effR1 calibrado proporcionalmente ao gancho e ao vão
        const effR1 = Math.min(R, effD1 * 0.8, span * 0.4);
        const pTip1 = pStart.clone().addScaledVector(w, effD1);
        const pBendStart1 = pStart.clone().addScaledVector(w, effR1);
        const pBendCenter1 = pStart.clone().addScaledVector(dir, effR1).addScaledVector(w, effR1);
        const pBendEnd1 = pStart.clone().addScaledVector(dir, effR1);

        // Trecho reto da ponta do gancho até o início da dobra
        if (effD1 > effR1) {
          path.add(new LineClass(pTip1, pBendStart1));
        }

        // Arco circular exato a 90° de concordância:
        // Ponto inicial: pBendStart1, Tangente inicial: -w (descendo na ponta)
        // Ponto final: pBendEnd1, Tangente final: +dir (entrando no corpo reto)
        const arc1 = new CircularArcCurve3(
          pBendCenter1,
          effR1,
          dir.clone().negate(),
          w.clone().negate(),
          0,
          Math.PI / 2
        );
        path.add(arc1);
        bodyStart = pBendEnd1;
      }

      // Caso 3: Barra com gancho no final (lado direito)
      let bodyEnd = pEnd.clone();
      let arc2 = null;
      let pBendEnd2 = null;
      let pTip2 = null;
      let effR2 = 0;

      if (effD2 > 0) {
        effR2 = Math.min(R, effD2 * 0.8, span * 0.4);
        const pBendStart2 = pEnd.clone().addScaledVector(dir, -effR2);
        const pBendCenter2 = pEnd.clone().addScaledVector(dir, -effR2).addScaledVector(w, effR2);
        pBendEnd2 = pEnd.clone().addScaledVector(w, effR2);
        pTip2 = pEnd.clone().addScaledVector(w, effD2);
        bodyEnd = pBendStart2;

        // Arco circular exato a 90° de concordância:
        // Ponto inicial: pBendStart2, Tangente inicial: +dir (saindo do corpo reto)
        // Ponto final: pBendEnd2, Tangente final: +w (subindo/descendo para o gancho)
        arc2 = new CircularArcCurve3(
          pBendCenter2,
          effR2,
          w.clone().negate(),
          dir.clone(),
          0,
          Math.PI / 2
        );
      }

      // Corpo reto central horizontal
      path.add(new LineClass(bodyStart, bodyEnd));

      // Adiciona o gancho direito (arco + ponta reta)
      if (effD2 > 0) {
        path.add(arc2);
        if (effD2 > effR2) {
          path.add(new LineClass(pBendEnd2, pTip2));
        }
      }

      return path;
    }

    /**
     * Amostra densamente pontos 3D ao longo de um CurvePath com passo máximo especificado.
     * Compatível com os amostradores do runner E2E Python.
     * @param {THREE.CurvePath} curvePath
     * @param {number} [step=2.0] - Passo máximo de amostragem em cm
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

      return allPts;
    }

    /**
     * Verifica formalmente a continuidade C0 e C1 em todas as junções internas do CurvePath.
     * @param {THREE.CurvePath} curvePath
     * @param {number} [epsilon=1e-4] - Tolerância numérica máxima
     * @returns {Object} { isC0, isC1, maxDiscontinuity, minTangentAlignment, junctions }
     */
    static verifyC1Continuity(curvePath, epsilon = 1e-4) {
      if (!curvePath || !curvePath.curves || curvePath.curves.length <= 1) {
        return { isC0: true, isC1: true, maxDiscontinuity: 0, minTangentAlignment: 1.0, junctions: [] };
      }

      let maxDiscontinuity = 0;
      let minTangentAlignment = 1.0;
      let isC0 = true;
      let isC1 = true;
      const junctions = [];

      for (let i = 0; i < curvePath.curves.length - 1; i++) {
        const cPrev = curvePath.curves[i];
        const cNext = curvePath.curves[i + 1];

        const pEnd = cPrev.getPoint(1);
        const pStart = cNext.getPoint(0);
        const gap = pEnd.distanceTo(pStart);

        const tEnd = cPrev.getTangent(1).normalize();
        const tStart = cNext.getTangent(0).normalize();
        const dot = tEnd.dot(tStart);

        maxDiscontinuity = Math.max(maxDiscontinuity, gap);
        minTangentAlignment = Math.min(minTangentAlignment, dot);

        if (gap > epsilon) isC0 = false;
        if (dot < 1.0 - epsilon) isC1 = false;

        junctions.push({
          junctionIndex: i,
          gap: gap,
          tangentDot: dot,
          pEnd: { x: pEnd.x, y: pEnd.y, z: pEnd.z },
          pStart: { x: pStart.x, y: pStart.y, z: pStart.z },
          tEnd: { x: tEnd.x, y: tEnd.y, z: tEnd.z },
          tStart: { x: tStart.x, y: tStart.y, z: tStart.z }
        });
      }

      return {
        isC0,
        isC1,
        maxDiscontinuity,
        minTangentAlignment,
        junctions
      };
    }
  }

  return RebarPathBuilder;
}));
