// Entry point. Wires up the mode switcher and renders the active mode
// into #app. Each mode module (reading.js / vocab.js / grammar.js) is
// expected to expose a `render(container)` function once implemented.

const modes = {
  reading: null, // TODO: window.ReadingMode.render
  vocab: null,   // TODO: window.VocabMode.render
  grammar: null, // TODO: window.GrammarMode.render
};

function setMode(name) {
  const container = document.getElementById('app');
  container.innerHTML = `<p>${name} mode — not implemented yet.</p>`;
  // TODO: call modes[name](container) once each mode is implemented.
}

document.getElementById('mode-switcher').addEventListener('click', (e) => {
  const mode = e.target?.dataset?.mode;
  if (mode) setMode(mode);
});

setMode('reading');
