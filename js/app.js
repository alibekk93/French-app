// Entry point: mode switching + LibreTranslate settings.

function esc(s) {
  return String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

const modes = { reading: ReadingMode, vocab: VocabMode, grammar: GrammarMode };

function setMode(name) {
  closePopup();
  document.querySelectorAll('#mode-switcher button').forEach((b) => {
    b.classList.toggle('active', b.dataset.mode === name);
  });
  modes[name].render(document.getElementById('app'));
}

document.getElementById('mode-switcher').onclick = (e) => {
  const mode = e.target?.dataset?.mode;
  if (mode) setMode(mode);
};

// Settings: which LibreTranslate instance to use.
const ltUrl = document.getElementById('lt-url');
const ltKey = document.getElementById('lt-key');
ltUrl.value = Translate.url();
ltKey.value = Translate.key();
document.getElementById('lt-save').onclick = () => {
  Translate.setConfig(ltUrl.value.trim(), ltKey.value.trim());
  document.getElementById('lt-status').textContent = 'Saved.';
};

setMode('reading');
