/** Rational Number. */

// To compare numbers, we represent rational number as normal form:
// For any rational number n/d,
// - n ∈ ℤ, d ∈ ℕ
// - n & d are mutually prime
// - d > 0

import { ErrorI18n } from './errors.js';

/** Finds the greatest common divisor
 * @param {number} a
 * @param {number} b */
const gcd = (a, b) => {
  if (!b) {
    return a;
  }

  return gcd(b, a % b);
};

/**
 * @param {number} n
 * @param {number} d
 */
export function RationalNumber(n, d = 1) {
  this.n = n;
  this.d = d;
  if (this.d === 0) {
    throw new Error('RationalNumber: denominator must not be 0');
  }
  if (!Number.isInteger(n)) {
    throw new Error('RationalNumber: numerator must be integer');
  }
  if (!Number.isInteger(d)) {
    throw new Error('RationalNumber: denominator must be integer');
  }
  if (this.d < 0) {
    this.n *= -1;
    this.d *= -1;
  }

  const _gcd = gcd(Math.abs(this.n), Math.abs(this.d));
  this.n /= _gcd;
  this.d /= _gcd;
}

RationalNumber.equal = function(a, b) {
  if (a.n !== b.n) {
    return false;
  }
  if (a.d !== b.d) {
    return false;
  }
  return true;
};

RationalNumber.prototype.equalsTo = function(that) {
  return RationalNumber.equal(this, that);
};

RationalNumber.prototype.isZero = function() {
  return this.n === 0;
}

RationalNumber.prototype.toString = function() {
  if (this.d === 1) {
    return this.n.toString();
  }
  return `${this.n.toString()}/${this.d.toString()}`;
};

RationalNumber.prototype.toMathML = function() {
  if (this.d === 1) {
    return `<mn>${this.n}</mn>`;
  }
  const n = `<mn>${this.n.toString()}</mn>`;
  const d = `<mn>${this.d.toString()}</mn>`;
  return `<mfrac>${n}${d}</mfrac>`;
};

RationalNumber.add = function(a, b) {
  const n = (a.n * b.d) + (a.d * b.n);
  const d = a.d * b.d;
  return new RationalNumber(n, d);
};

RationalNumber.sub = function(a, b) {
  const n = (a.n * b.d) - (a.d * b.n);
  const d = a.d * b.d;
  return new RationalNumber(n, d);
};

RationalNumber.mult = function(a, b) {
  return new RationalNumber(a.n*b.n, a.d*b.d);
};

RationalNumber.div = function(a, b) {
  if (b.isZero()) {
    throw new ErrorI18n(
      'Zero division occured',
      '0 による割り算が起こりました'
    );
  }
  return new RationalNumber(a.n*b.d, a.d*b.n);
};

