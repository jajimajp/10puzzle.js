// # BNF for ast
// This is not used directly. LL(1) alternative below are used.
// <term> ::=
//   <pexpr>
// <pexpr> ::=
//   <pexpr> "+" <mexpr>
// | <pexpr> "-" <mexpr>
// | <mexpr>
// <mexpr> ::=
//   <mexpr> "*" <aexpr>
// | <mexpr> "/" <aexpr>
// | <aexpr>
// <aexpr> ::=
//   <digit>
// | "(" <pexpr> ")"
// <digit> ::= ("0"|"1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9")
//
// spaces(" "|"\t"|"\n") are ignored.
// Input length must have length at most 100.
//
// # Grammer for parsing (LL(1))
// cf. https://blog.tiqwab.com/2017/01/04/recursive-descent-parser.html
// e means empty. <digits> is the same as above.
// <term> ::=
//   <pexpr0>
// <pexpr0> ::=
//   <mexpr0> <pexpr1>
// <pexpr1> ::=
//   "+" <mexpr0> <pexpr1>
// | "-" <mexpr0> <pexpr1>
// | e
// <mexpr0> ::=
//   <aexpr> <mexpr1>
// <mexpr1> ::=
//   "*" <axpr> <mexpr1>
// | "/" <axpr> <mexpr1>
// | e
// <aexpr> ::=
//   "(" <pexpr0> ")"
// | <digit>

import { digit, plus, minus, mult, div } from './ast.js';

export class ParseError extends Error {}

/**
 * @param {Generator} gen
 */
function Peeker(gen) {
  let value = undefined;
  let done = false;
  const peek = () => {
    if (!done && value === undefined) {
      const next = gen.next();
      value = next.value;
      done = next.done;
      if (next === undefined && !done) {
        throw new Error('generator returned undefined as value');
      }
    }
    return { value, done };
  };
  const pop = () => {
    const next = gen.next();
    value = next.value;
    done = next.done;
  }
  return { peek, pop };
}

export function Parser(tokenGenerator) {
  this.tokGen = Peeker(tokenGenerator);
}

Parser.prototype.parse = function() {
  // <term> ::= <pexpr0>
  return this.pexpr0();
};

Parser.prototype.pexpr0 = function() {
  // <pexpr0> ::= <mexpr0> <pexpr1>
  const e = this.mexpr0();
  return this.pexpr1(e);
};

Parser.prototype.pexpr1 = function(e) {
  // <pexpr1> ::=
  //   "+" <mexpr0> <pexpr1>
  // | "-" <mexpr0> <pexpr1>
  // | e
  const { value, done } = this.tokGen.peek();
  if (done) {
    return e;
  }
  if (value === "+") {
    this.tokGen.pop();
    const e2 = this.mexpr0();
    return this.pexpr1(plus(e, e2));
  } else if (value === "-") {
    this.tokGen.pop();
    const e2 = this.mexpr0();
    return this.pexpr1(minus(e, e2));
  } else {
    return e;
  }
};

Parser.prototype.mexpr0 = function() {
  // <mexpr0> ::= <aexpr> <mexpr1>
  const e = this.aexpr();
  return this.mexpr1(e);
};

Parser.prototype.mexpr1 = function(e) {
  // <mexpr1> ::=
  //   "*" <axpr> <mexpr1>
  // | "/" <axpr> <mexpr1>
  // | e
  const { value, done } = this.tokGen.peek();
  if (done) {
    return e;
  }
  if (value === "*") {
    this.tokGen.pop();
    const e2 = this.aexpr();
    return this.mexpr1(mult(e, e2));
  } else if (value === "/") {
    this.tokGen.pop();
    const e2 = this.aexpr();
    return this.mexpr1(div(e, e2));
  } else {
    return e;
  }
};

Parser.prototype.aexpr = function() {
  // <aexpr> ::=
  //   "(" <pexpr0> ")"
  // | <digit>

  const { value, done } = this.tokGen.peek();
  if (done) {
    throw new ParseError("Unexpected end of input: Expeced <aexpr>");
  }
  if (value === "(") {
    this.tokGen.pop();
    const e = this.pexpr0();
    if (this.tokGen.peek().done) {
      throw new ParseError(`Unexpected end of input: Expected ")"`);
    }
    const next = this.tokGen.peek();
    this.tokGen.pop();
    if (next.value !== ")") {
      throw new ParseError(`")" expected but got ${next.value}`);
    }
    return e;
  }
  if ("0123456789".includes(value)) {
    this.tokGen.pop();
    return digit(Number(value));
  } else {
    throw new ParseError(`DIGIT expected but got ${value}`);
  }
};

