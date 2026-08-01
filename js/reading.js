// Reading mode: load text from a URL or paste it, select any word/phrase to
// translate, save selections to the dictionary.

// ponytail: r.jina.ai does both the CORS proxy and the article extraction in
// one request. Swap for a own proxy + readability parser if it goes away.
const READER_PROXY = 'https://r.jina.ai/';

const ReadingMode = {
  render(container) {
    container.innerHTML = `
      <section class="pane">
        <div class="row">
          <input id="r-url" placeholder="https://… article URL">
          <button id="r-load">Load</button>
        </div>
        <details>
          <summary>…or paste text</summary>
          <textarea id="r-text" rows="6" placeholder="Collez votre texte ici"></textarea>
          <button id="r-show">Show</button>
        </details>
        <p id="r-status" class="status"></p>
      </section>
      <article id="reader"></article>
    `;
    container.querySelector('#r-load').onclick = () => this.load(container);
    container.querySelector('#r-show').onclick = () =>
      this.show(container, container.querySelector('#r-text').value);

    const reader = container.querySelector('#reader');
    reader.onmouseup = () => this.onSelect(reader);
  },

  async load(container) {
    const url = container.querySelector('#r-url').value.trim();
    const status = container.querySelector('#r-status');
    if (!url) return;
    status.textContent = 'Loading…';
    try {
      const res = await fetch(READER_PROXY + url);
      if (!res.ok) throw new Error(res.status);
      this.show(container, await res.text());
      status.textContent = '';
    } catch (err) {
      status.textContent = 'Could not load that URL (' + err.message + '). Paste the text instead.';
    }
  },

  show(container, text) {
    container.querySelector('#reader').innerHTML = text
      .split(/\n{2,}/)
      .filter((p) => p.trim())
      .map((p) => `<p>${esc(p.trim())}</p>`)
      .join('');
  },

  async onSelect(reader) {
    const text = (window.getSelection().toString() || '').trim();
    closePopup();
    if (!text) return;

    const rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
    const pop = openPopup(rect, `<p class="fr">${esc(text)}</p><p>Translating…</p>`);
    try {
      const entry = await Translate.both(text);
      pop.innerHTML = `
        <p class="fr">${esc(entry.french)}</p>
        <p>EN — ${esc(entry.english)}</p>
        <p>RU — ${esc(entry.russian)}</p>
        <button id="p-save">Save to dictionary</button>
      `;
      pop.querySelector('#p-save').onclick = () => {
        Dictionary.add(entry);
        pop.querySelector('#p-save').textContent = 'Saved';
      };
    } catch (err) {
      pop.innerHTML = `<p class="fr">${esc(text)}</p><p>Translation failed: ${esc(err.message)}</p>`;
    }
  },
};

function openPopup(rect, html) {
  const pop = document.createElement('div');
  pop.id = 'popup';
  pop.innerHTML = html;
  pop.style.top = window.scrollY + rect.bottom + 8 + 'px';
  pop.style.left = window.scrollX + rect.left + 'px';
  pop.onmouseup = (e) => e.stopPropagation();
  document.body.appendChild(pop);
  return pop;
}

function closePopup() {
  document.getElementById('popup')?.remove();
}
