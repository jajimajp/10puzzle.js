import { digit, plus, minus, mult, div } from '../resources/scripts/ast';

test('ast', () => {
  const ast =
    plus(mult(plus(digit(1), digit(2))
             ,minus(digit(3), digit(1)))
        ,div(digit(4), digit(2)));
  expect(ast.eval()).toBe(8);
});

