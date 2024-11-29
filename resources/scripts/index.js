const url = new URL(document.location.href);

const root = document.querySelector('#root');
root.innerHTML = `<p>The URL hash is ${url.hash}.`;

