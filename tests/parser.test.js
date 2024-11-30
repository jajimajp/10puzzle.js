import { Parser } from '../resources/scripts/parser';

/**
 * @param {string} s
 * @yields {string} */
function* simpleTokGen(s) {
  for (const c of s) {
    yield c;
  }
}

test('', () => {
  const input = "(1+1)*(2-0)"
  const p = new Parser(simpleTokGen(input));
  p.parse();
});

test('', () => {
  const input = "100"
  const p = new Parser(simpleTokGen(input));
  expect(() => { p.parse() }).toThrow();
});

