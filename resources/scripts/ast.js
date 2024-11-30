/** The AST.
 * Each AST has:
 * - `eval: () => RationalNumber`
 * - `ints: () => number[]`. */

import { ErrorI18n } from './errors.js';
import { RationalNumber } from './rationalNumber.js';

class InvalidDigitError extends ErrorI18n {
  constructor(d) {
    const msgEn = `${d} is not valid digit`;
    const msgJa = `${d} は有効な数字ではありません`;
    super(msgEn, msgJa);
  }
}


const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
export const digit = (d) => {
  if (!digits.includes(d)) {
    throw new InvalidDigitError(d);
  }
  return {
    eval: () => new RationalNumber(d),
    ints: () => [d],
  };
};

export const plus = (l, r) => {
  return {
    eval: () => RationalNumber.add(l.eval(), r.eval()),
    ints: () => l.ints().concat(r.ints()),
  }
};

export const minus = (l, r) => {
  return {
    eval: () => RationalNumber.sub(l.eval(), r.eval()),
    ints: () => l.ints().concat(r.ints()),
  }
};

export const mult = (l, r) => {
  return {
    eval: () => RationalNumber.mult(l.eval(), r.eval()),
    ints: () => l.ints().concat(r.ints()),
  }
};

export const div = (l, r) => {
  return {
    eval: () => RationalNumber.div(l.eval(), r.eval()),
    ints: () => l.ints().concat(r.ints()),
  }
};

