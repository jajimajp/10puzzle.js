import { Parser } from './parser.js';
import { tokenize } from './lexer.js';

const root = document.querySelector('#root');
root.innerHTML = `
<p id="status"></p>
<input type="text" id="textinput" />
<input type="button" id="button" value="Check" />
`;

const status = document.querySelector('#status');
const textinput = document.querySelector('#textinput');
const button = document.querySelector('#button');

/** @param {string} statusText */
const renderStatus = (statusText) => {
  status.textContent = statusText;
};

const url = new URL(document.location.href);
renderStatus(`The URL hash is ${url.hash}`);

button.addEventListener('click', () => {
  console.log('textinput.value', textinput.value);
  check(textinput.value);
});

/** @param {string} input */
const check = (input) => {
  try {
    const tokens = tokenize(input);
    const ast = new Parser(tokens).parse();
    const result = ast.eval();

    renderStatus(`${input} => ${result}`);
  } catch(e) {
    console.error(e);
  }
};

