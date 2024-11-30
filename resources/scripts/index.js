import { Parser } from './parser.js';
import { tokenize } from './lexer.js';
import { ErrorI18n } from './errors.js';
import { Problem, NotEvaluateTo10Error } from './problem.js';


const problemElem = document.querySelector('#problem');
const status = document.querySelector('#status');
const answer = document.querySelector('#answer');
const button = document.querySelector('#checkButton');


/** @param {string} statusText */
const renderStatus = (statusText) => {
  status.innerHTML = statusText;
};

const url = new URL(document.location.href);
console.log('pathname', url.pathname);
const isJapanese = url.pathname.endsWith('ja');
const problem = Problem.fromURL(url);

if (isJapanese) {
  problemElem.innerHTML = `<p>${problem.toStringJa()}</p>`;
} else {
  problemElem.innerHTML = `<p>${problem.toString()}</p>`;
}

button.addEventListener('click', () => {
  check(answer.value);
});

/** @param {string} input */
const check = (input) => {
  try {
    const tokens = tokenize(input);
    const ast = new Parser(tokens).parse();
    const result = ast.eval();

    const inputMathML = concatStringGen(tokensToMathMLs(tokenize(input)));
    const resultMathML = result.toMathML();
    const mathML = `<math>${inputMathML}<mo>=</mo>${resultMathML}</math>`;

    problem.verify(ast);

    // Success
    const elem = isJapanese
      ? `<span>${mathML} 💮</span>`
      : `<span>${mathML} 👏</span>`


    renderStatus(elem);
  } catch(e) {
    if (e instanceof NotEvaluateTo10Error) {
      const tokens = tokenize(input);
      const ast = new Parser(tokens).parse();
      const result = ast.eval();
      const inputMathML = concatStringGen(tokensToMathMLs(tokenize(input)));
      const resultMathML = result.toMathML();
      const mathML = `<math>${inputMathML}<mo>=</mo>${resultMathML}</math>`;
      const msg = isJapanese ? e.messageJa : e.message;
      renderStatus(`${msg}: ${mathML}`);
    } else if (e instanceof ErrorI18n) {
      const msg = isJapanese ? e.messageJa : e.message;
      renderStatus(msg);
    } else {
      console.error(e);
    }
  }
};

const concatStringGen = (gen) => {
  let s = "";
  for (const c of gen) {
    s += c;
  }
  return s;
};

function* tokensToMathMLs(tokGen) {
  const digits = "0123456789";
  const opMap = {
    "+": "<mo>+</mo>",
    "-": "<mo>&minus;</mo>",
    "*": "<mo>&times;</mo>",
    "/": "<mo>&divide;</mo>",
    "(": "<mo>(</mo>",
    ")": "<mo>)</mo>",
  };
  for (const tok of tokGen) {
    if (digits.includes(tok)) {
      yield `<mn>${tok}</mn>`;
    } else {
      const ml = opMap[tok];
      if (ml === undefined) {
        throw new Error(`tokensToMathMLs: received invalid token ${tok}`);
      }
      yield ml;
    }
  }
}
