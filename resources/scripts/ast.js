const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
export const digit = (d) => {
  if (!digits.includes(d)) {
    throw Error(`Dight: ${d} is not valid digit`);
  }
  return {
    eval: () => d,
  };
};

export const plus = (l, r) => {
  return {
    eval: () => l.eval() + r.eval(),
  }
};

export const minus = (l, r) => {
  return {
    eval: () => l.eval() - r.eval(),
  }
};

export const mult = (l, r) => {
  return {
    eval: () => l.eval() * r.eval(),
  }
};

export const div = (l, r) => {
  return {
    eval: () => l.eval() / r.eval(),
  }
};

