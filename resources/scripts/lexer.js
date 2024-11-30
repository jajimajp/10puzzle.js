/** The tokenizer. Because all the token in this app is a character,
 *  we do not assign symbol for tokens; just use character as is. */

import { ErrorI18n } from './errors.js';

/**
 * @params {number} position
 * @params {string} character
 */
class InvalidInputError extends ErrorI18n {
  constructor(position, character) {
    const msgEn = `Invalid character ${character} at position ${position}`;
    const msgJa = `位置 ${position} で，使えない文字 ${character} が与えられました`;
    super(msgEn, msgJa);
  }
}

/** Valid characters as input */
export const validCharacters = "0123456789()+-*/ ";
export const tokenCharacters = "0123456789()+-*/";

/**
 * @param {string} s
 *  @returns {boolean} */
export const isOfValidCharacters = (s) => {
  for (const c of s) {
    if (!validCharacters.includes(c)) {
      return false;
    }
  }
  return true;
};

/**
 * @param {string} input
 * @yields {string} The token character. */
export function* tokenize(s) {
  let i = 0;
  for (const c of s) {
    if (!isOfValidCharacters(c)) {
      throw new InvalidInputError(i, c);
    }
    if (tokenCharacters.includes(c)) {
      yield c;
    }
    ++i;
  }
};

