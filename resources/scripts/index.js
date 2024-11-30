import { Parser } from './parser.js';
import { tokenize } from './lexer.js';
import { ErrorI18n } from './errors.js';
import { Problem, NotEvaluateTo10Error } from './problem.js';

const root = document.querySelector('#root');
root.innerHTML = `
<div id="problem"></div>
<div id="status"></div>
<input type="text" id="textinput" />
<input type="button" id="button" value="Check" />
`;
const problemElem = document.querySelector('#problem');
const status = document.querySelector('#status');
const textinput = document.querySelector('#textinput');
const button = document.querySelector('#button');

/** @param {string} statusText */
const renderStatus = (statusText) => {
  status.innerHTML = statusText;
};

const url = new URL(document.location.href);
const problem = Problem.fromURL(url);

problemElem.innerHTML = `<p>${problem.toStringJa()}</p>`;

button.addEventListener('click', () => {
  check(textinput.value);
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
    const elem = `<span>${mathML} 💮</span>`

    renderStatus(elem);
  } catch(e) {
    if (e instanceof NotEvaluateTo10Error) {
      const tokens = tokenize(input);
      const ast = new Parser(tokens).parse();
      const result = ast.eval();
      const inputMathML = concatStringGen(tokensToMathMLs(tokenize(input)));
      const resultMathML = result.toMathML();
      const mathML = `<math>${inputMathML}<mo>=</mo>${resultMathML}</math>`;
      renderStatus(`${e.messageJa}: ${mathML}`);
    } else if (e instanceof ErrorI18n) {
      renderStatus(e.messageJa);
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
