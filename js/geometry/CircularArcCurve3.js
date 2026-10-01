/**
 * CircularArcCurve3.js
 * 
 * Subclasse de THREE.Curve para arcos de circunferência tridimensionais exatos a 90°.
 * Implementação em estrita conformidade com a NBR 6118:2023 (Tabela 9.1 e Item 9.4.2.3).
 *
 * Características Matemáticas:
 *   - Parametrização analítica trigonométrica contínua:
 *       P(t) = C + R * cos(theta(t)) * uAxis + R * sin(theta(t)) * vAxis
 *       onde theta(t) = startAngle + t * (endAngle - startAngle)
 *   - Curvatura constante kappa = 1/R em 100% dos pontos (elimina distorções de Bézier / splines).
 *   - Continuidade C1 rigorosa com derivadas analíticas exatas.
 *   - Vetores tangentes unitários em qualquer t em [0, 1].
 *   - Calibração de raios normativos de dobramento:
 *       * Aço CA-50 longitudinal: R = 3.0 * phi (phi < 20 mm) ou 4.5 * phi (phi >= 20 mm)
 *       * Aço CA-60 estribos: R = 2.0 * phi (phi <= 10 mm)
 *
 * Dual export: Browser (window.CircularArcCurve3) e Node.js (module.exports).
 */

(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['three'], factory);
  } else if (typeof module === 'object' && module.exports) {
    let THREE = (typeof root !== 'undefined' && root.THREE) ? root.THREE : null;
    if (!THREE) {
      try {
        THREE = require('three');
      } catch (e) {
        THREE = null;
      }
    }
    const exported = factory(THREE);
    module.exports = exported;
    if (typeof root !== 'undefined') {
      root.CircularArcCurve3 = exported;
    }
  } else {
    root.CircularArcCurve3 = factory(root.THREE);
  }
}(typeof self !== 'undefined' ? self : (typeof global !== 'undefined' ? global : this), function (THREE) {
  'use strict';

  // Fallback classes caso THREE não esteja no escopo global (ex: testes puros em Node sem vendor)
  const Vector3 = (THREE && THREE.Vector3) ? THREE.Vector3 : class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
      this.x = Number(x);
      this.y = Number(y);
      this.z = Number(z);
    }
    set(x, y, z) {
      this.x = x; this.y = y; this.z = z;
      return this;
    }
    copy(v) {
      this.x = v.x; this.y = v.y; this.z = v.z;
      return this;
    }
    clone() {
      return new Vector3(this.x, this.y, this.z);
    }
    add(v) {
      this.x += v.x; this.y += v.y; this.z += v.z;
      return this;
    }
    sub(v) {
      this.x -= v.x; this.y -= v.y; this.z -= v.z;
      return this;
    }
    addScaledVector(v, s) {
      this.x += v.x * s; this.y += v.y * s; this.z += v.z * s;
      return this;
    }
    dot(v) {
      return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    distanceTo(v) {
      const dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    normalize() {
      const l = this.length();
      if (l > 1e-12) {
        this.x /= l; this.y /= l; this.z /= l;
      } else {
        this.x = 0; this.y = 0; this.z = 0;
      }
      return this;
    }
    negate() {
      this.x = -this.x; this.y = -this.y; this.z = -this.z;
      return this;
    }
    crossVectors(a, b) {
      const ax = a.x, ay = a.y, az = a.z;
      const bx = b.x, by = b.y, bz = b.z;
      this.x = ay * bz - az * by;
      this.y = az * bx - ax * bz;
      this.z = ax * by - ay * bx;
      return this;
    }
  };

  const BaseCurve = (THREE && THREE.Curve) ? THREE.Curve : class Curve {
    constructor() {
      this.type = 'Curve';
      this.arcLengthDivisions = 200;
    }
    getPoint(t, optionalTarget) {
      return optionalTarget || new Vector3();
    }
    getPointAt(u, optionalTarget) {
      const t = this.getUtoTmapping(u);
      return this.getPoint(t, optionalTarget);
    }
    getTangent(t, optionalTarget) {
      const delta = 0.0001;
      let t1 = t - delta;
      let t2 = t + delta;
      if (t1 < 0) t1 = 0;
      if (t2 > 1) t2 = 1;
      const pt1 = this.getPoint(t1);
      const pt2 = this.getPoint(t2);
      const vec = optionalTarget || new Vector3();
      vec.copy(pt2).sub(pt1).normalize();
      return vec;
    }
    getTangentAt(u, optionalTarget) {
      const t = this.getUtoTmapping(u);
      return this.getTangent(t, optionalTarget);
    }
    getLength() {
      const lengths = this.getLengths();
      return lengths[lengths.length - 1];
    }
    getLengths(divisions = this.arcLengthDivisions) {
      if (this.cacheArcLengths && this.cacheArcLengths.length === divisions + 1) {
        return this.cacheArcLengths;
      }
      const cache = [];
      let current, last = this.getPoint(0);
      let sum = 0;
      cache.push(0);
      for (let p = 1; p <= divisions; p++) {
        current = this.getPoint(p / divisions);
        sum += current.distanceTo(last);
        cache.push(sum);
        last = current;
      }
      this.cacheArcLengths = cache;
      return cache;
    }
    getUtoTmapping(u, distance) {
      const arcLengths = this.getLengths();
      let i = 0;
      const il = arcLengths.length;
      let targetArcLength;
      if (distance) {
        targetArcLength = distance;
      } else {
        targetArcLength = u * arcLengths[il - 1];
      }
      let low = 0, high = il - 1, comparison;
      while (low <= high) {
        i = Math.floor(low + (high - low) / 2);
        comparison = arcLengths[i] - targetArcLength;
        if (comparison < 0) {
          low = i + 1;
        } else if (comparison > 0) {
          high = i - 1;
        } else {
          high = i;
          break;
        }
      }
      i = high;
      if (arcLengths[i] === targetArcLength) {
        return i / (il - 1);
      }
      const lengthBefore = arcLengths[i];
      const lengthAfter = arcLengths[i + 1];
      const segmentLength = lengthAfter - lengthBefore;
      const segmentFraction = (targetArcLength - lengthBefore) / segmentLength;
      const t = (i + segmentFraction) / (il - 1);
      return t;
    }
    getPoints(divisions = 5) {
      const points = [];
      for (let d = 0; d <= divisions; d++) {
        points.push(this.getPoint(d / divisions));
      }
      return points;
    }
  };

  /**
   * Classe CircularArcCurve3
   * Modela um arco circular tridimensional exato como uma curva contínua C1 de raio constante.
   */
  class CircularArcCurve3 extends BaseCurve {
    /**
     * @param {THREE.Vector3|Object} center - Centro do círculo de dobramento (cm)
     * @param {number} radius - Raio até o eixo da barra (R = r_int + phi/2) em cm
     * @param {THREE.Vector3|Object} uAxis - Vetor unitário diretor para theta = startAngle
     * @param {THREE.Vector3|Object} vAxis - Vetor unitário ortogonal no plano do arco
     * @param {number} [startAngle=0] - Ângulo inicial em radianos (default 0)
     * @param {number} [endAngle=Math.PI/2] - Ângulo final em radianos (default pi/2)
     */
    constructor(center, radius, uAxis, vAxis, startAngle = 0, endAngle = Math.PI / 2) {
      super();
      this.type = 'CircularArcCurve3';
      this.isCircularArcCurve3 = true;

      const Vec = (THREE && THREE.Vector3) ? THREE.Vector3 : Vector3;

      this.center = center instanceof Vec ? center.clone() : new Vec(center.x, center.y, center.z);
      this.radius = Math.max(1e-4, Number(radius));

      this.uAxis = uAxis instanceof Vec ? uAxis.clone().normalize() : new Vec(uAxis.x, uAxis.y, uAxis.z).normalize();
      this.vAxis = vAxis instanceof Vec ? vAxis.clone().normalize() : new Vec(vAxis.x, vAxis.y, vAxis.z).normalize();

      // Assegura ortogonalidade estrita no plano: vAxis_perp = (vAxis - (vAxis.dot(uAxis)) * uAxis).normalize()
      const dot = this.vAxis.dot(this.uAxis);
      if (Math.abs(dot) > 1e-6) {
        this.vAxis.addScaledVector(this.uAxis, -dot).normalize();
      }

      this.startAngle = Number(startAngle);
      this.endAngle = Number(endAngle);
    }

    /**
     * Retorna o ponto 3D amostrado na curva para o parâmetro t em [0, 1].
     * P(t) = center + radius * (cos(angle) * uAxis + sin(angle) * vAxis)
     * @param {number} t - Parâmetro normalizado [0, 1]
     * @param {THREE.Vector3} [optionalTarget] - Vetor de destino opcional
     * @returns {THREE.Vector3}
     */
    getPoint(t, optionalTarget) {
      const Vec = (THREE && THREE.Vector3) ? THREE.Vector3 : Vector3;
      const point = optionalTarget || new Vec();

      const delta = this.endAngle - this.startAngle;
      const angle = this.startAngle + t * delta;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      point.copy(this.center)
        .addScaledVector(this.uAxis, this.radius * cosA)
        .addScaledVector(this.vAxis, this.radius * sinA);

      return point;
    }

    /**
     * Retorna o vetor tangente unitário exato na curva para o parâmetro t em [0, 1].
     * Derivada analítica exata:
     *   dP/dt = delta * radius * (-sin(angle) * uAxis + cos(angle) * vAxis)
     *   T(t) = sign(delta) * (-sin(angle) * uAxis + cos(angle) * vAxis)
     * @param {number} t - Parâmetro normalizado [0, 1]
     * @param {THREE.Vector3} [optionalTarget] - Vetor de destino opcional
     * @returns {THREE.Vector3}
     */
    getTangent(t, optionalTarget) {
      const Vec = (THREE && THREE.Vector3) ? THREE.Vector3 : Vector3;
      const tangent = optionalTarget || new Vec();

      const delta = this.endAngle - this.startAngle;
      const angle = this.startAngle + t * delta;
      const sign = delta >= 0 ? 1.0 : -1.0;
      const sinA = Math.sin(angle);
      const cosA = Math.cos(angle);

      tangent.set(0, 0, 0)
        .addScaledVector(this.uAxis, -sinA * sign)
        .addScaledVector(this.vAxis, cosA * sign)
        .normalize();

      return tangent;
    }

    /**
     * Retorna a curvatura escalar analítica constante kappa = 1 / R (cm^-1).
     * @returns {number}
     */
    getCurvature() {
      return 1.0 / this.radius;
    }

    /**
     * Retorna o comprimento exato do arco de circunferência: L = |deltaAngle| * R.
     * @returns {number}
     */
    getLength() {
      return Math.abs(this.endAngle - this.startAngle) * this.radius;
    }

    /**
     * Clona a instância atual.
     * @returns {CircularArcCurve3}
     */
    clone() {
      return new CircularArcCurve3(
        this.center,
        this.radius,
        this.uAxis,
        this.vAxis,
        this.startAngle,
        this.endAngle
      );
    }

    /**
     * Copia as propriedades de outra instância.
     * @param {CircularArcCurve3} source
     * @returns {CircularArcCurve3}
     */
    copy(source) {
      super.copy(source);
      this.center.copy(source.center);
      this.radius = source.radius;
      this.uAxis.copy(source.uAxis);
      this.vAxis.copy(source.vAxis);
      this.startAngle = source.startAngle;
      this.endAngle = source.endAngle;
      return this;
    }

    /**
     * Calcula o raio normativo de dobramento NBR 6118:2023 (Tabela 9.1).
     * @param {number} phiMm - Diâmetro nominal da barra em milímetros (ex: 5.0, 10.0, 12.5, 16.0)
     * @param {string} [type='longitudinal'] - 'longitudinal' | 'CA-50' | 'stirrup' | 'CA-60' | 'estribo'
     * @returns {number} Raio normativo R = r_int + phi/2 (cm)
     */
    static getBendingRadius(phiMm, type = 'longitudinal') {
      const phiCm = (Number(phiMm) || 10.0) / 10.0;
      const t = String(type).toLowerCase();

      if (t === 'stirrup' || t === 'ca-60' || t === 'estribo') {
        // NBR 6118 estribos CA-60: D_pino = 3 * phi -> r_int = 1.5 * phi -> R = 2.0 * phi
        return Math.max(1.0, 2.0 * phiCm);
      }

      // NBR 6118 armadura longitudinal CA-50
      if (Number(phiMm) >= 20.0) {
        // D_pino = 8 * phi -> R = 4.5 * phi
        return Math.max(1.5, 4.5 * phiCm);
      }
      // phi < 20 mm: D_pino = 5 * phi -> r_int = 2.5 * phi -> R = 3.0 * phi
      return Math.max(1.5, 3.0 * phiCm);
    }

    /**
     * Cria um arco circular a 90° de concordância entre duas direções ortogonais num canto.
     * @param {THREE.Vector3} pCorner - Vértice teórico do canto 90°
     * @param {THREE.Vector3} inDir - Vetor diretor de entrada no canto (unitário)
     * @param {THREE.Vector3} outDir - Vetor diretor de saída do canto (unitário, ortogonal a inDir)
     * @param {number} radius - Raio de concordância (cm)
     * @returns {CircularArcCurve3}
     */
    static fromCornerFillet(pCorner, inDir, outDir, radius) {
      const Vec = (THREE && THREE.Vector3) ? THREE.Vector3 : Vector3;
      const r = Number(radius);
      const uIn = inDir instanceof Vec ? inDir.clone().normalize() : new Vec(inDir.x, inDir.y, inDir.z).normalize();
      const uOut = outDir instanceof Vec ? outDir.clone().normalize() : new Vec(outDir.x, outDir.y, outDir.z).normalize();

      // Centro do círculo de curvatura: C = pCorner - r * uIn + r * uOut
      const center = (pCorner instanceof Vec ? pCorner.clone() : new Vec(pCorner.x, pCorner.y, pCorner.z))
        .addScaledVector(uIn, -r)
        .addScaledVector(uOut, r);

      // uAxis aponta para o ponto de tangência de entrada: P_in - C = -r * uOut -> uAxis = -uOut
      const uAxis = uOut.clone().negate();
      // vAxis aponta no sentido de giro: tangente em theta=0 é uIn -> vAxis = uIn
      const vAxis = uIn.clone();

      return new CircularArcCurve3(center, r, uAxis, vAxis, 0, Math.PI / 2);
    }
  }

  return CircularArcCurve3;
}));
