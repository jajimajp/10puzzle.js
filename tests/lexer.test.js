import { isOfValidCharacters, tokenize } from '../resources/scripts/lexer';

describe('isOfValidCharacters', () => {
  it.each([
    [true, '1+2-3*4'],
    [true, '1/2-3*4'],
    [true, '1 / (2 - 3)*4'],
    [true, '1 //// (2 - 3)*4'],
    [false, 'あ //// (2 - 3)*4'],
    [false, '1\n'],
    [false, '1\t'],
  ])('returns %s for %s', (expected, input) => {
    expect(isOfValidCharacters(input)).toBe(expected);
  });
});

describe('tokenize', () => {
  it('skips white spaces', () => {
    const gen = tokenize(' 1 + 2 ');
    expect(gen.next()).toEqual({ value: '1', done: false });
    expect(gen.next()).toEqual({ value: '+', done: false });
    expect(gen.next()).toEqual({ value: '2', done: false });
    expect(gen.next()).toEqual({ value: undefined, done: true });
  });

  it('tokenizes number as is', () => {
    const gen = tokenize('100');
    expect(gen.next()).toEqual({ value: '1', done: false });
    expect(gen.next()).toEqual({ value: '0', done: false });
    expect(gen.next()).toEqual({ value: '0', done: false });
    expect(gen.next()).toEqual({ value: undefined, done: true });
  });
});
