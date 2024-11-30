import { ErrorI18n } from './errors.js';
import { RationalNumber } from './rationalNumber.js';

class InvalidURLError extends Error {}

class IncorrectError extends ErrorI18n {}

export class NotEvaluateTo10Error extends IncorrectError {
  constructor() {
    const me = 'Given answer is incorrect';
    const mj = '入力された式は 10 になりませんでした';
    super(me, mj);
  }
}

class NotMatchingNumbersError extends IncorrectError {
  /** @param {Problem} problem */
  constructor(problem) {
    const [a,b,c,d] = problem.nums;
    const msgEn = `You must use each digit of ${a}, ${b}, ${c} and ${d} exactly once`;
    const msgJa = `${a}, ${b}, ${c}, ${d} をちょうど１回ずつ使ってください`;
    super(msgEn, msgJa);
  }
}

export function Problem(nums) {
  if (nums.length !== 4) {
    throw new Error(`Invalid length of array: ${numArr}`);
  }
  this.nums = nums
}

Problem.fromURL = function(url) {
  if (url.hash.length !== "#0000".length) {
    throw new InvalidURLError();
  }
  if (url.hash[0] !== "#") {
    throw new InvalidURLError();
  }
  const nums = [];
  const digits = "0123456789";
  for (const c of url.hash.slice(1)) {
    if (!digits.includes(c)) {
      throw new InvalidURLError();
    }
    nums.push(Number(c));
  }
  return new Problem(nums);
};

Problem.prototype.toString = function() {
  const [a,b,c,d] = this.nums;
  return `Can you get 10 from ${a}, ${b}, ${c}, ${d}?`;
};

Problem.prototype.toStringJa = function() {
  const [a,b,c,d] = this.nums;
  return `${a}, ${b}, ${c}, ${d} から 10 をつくろう`;
};

Problem.prototype.verify = function(ast) {
  const ints = ast.ints();
  if (!equalAsSet(this.nums, ints)) {
    throw new NotMatchingNumbersError(this);
  }
  const result = ast.eval();
  if (!RationalNumber.equal(result, new RationalNumber(10))) {
    throw new NotEvaluateTo10Error();
  }
};

const equalAsSet = (a, b) => {
  if (a.length !== b.length) {
    return false;
  }
  const _a = a.toSorted();
  const _b = b.toSorted();
  return _a.every((ai, i) => ai === _b[i]);
};

