/** The tokenizer. Because all the token in this app is a character,
 *  we do not assign symbol for tokens; just use character as is. */

/**
 * @params {number} position
 * @params {number} length
 */
function InvalidInputError(position, length) {
  this.position = position;
  this.length = length;
  return this;
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
      throw new InvalidInputError(i, 1);
    }
    if (tokenCharacters.includes(c)) {
      yield c;
    }
    ++i;
  }
};

