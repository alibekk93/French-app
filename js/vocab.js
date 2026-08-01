// Vocab mode: dictionary management + infinite flashcard trainer.

// --- pure card logic (covered by test.js) ---

function normalize(s) {
  return (s || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .trim();
}

function shuffle(a) {
  const out = a.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// type: 'fr' (show French, hide translations) | 'tr' (show translations, hide
// French) | 'mix' (random per card)
function makeCard(entry, type) {
  const dir = type === 'mix' ? (Math.random() < 0.5 ? 'fr' : 'tr') : type;
  const translations = [entry.english, entry.russian].filter(Boolean);
  if (dir === 'fr') {
    return { dir, entry, prompt: entry.french, answers: translations, reveal: translations.join(' / ') };
  }
  return { dir, entry, prompt: translations.join(' / '), answers: [entry.french], reveal: entry.french };
}

function isCorrect(card, input) {
  return card.answers.some((a) => normalize(a) === normalize(input));
}

// 4 options: the answer plus 3 distractors from the rest of the dictionary.
// Returns null if the dictionary is too small — caller falls back to write-in.
function mcOptions(card, all) {
  const pick = (e) => (card.dir === 'fr' ? e.english : e.french);
  const pool = all.filter((e) => e !== card.entry).map(pick).filter(Boolean);
  if (pool.length < 3) return null;
  return shuffle([card.answers[0], ...shuffle(pool).slice(0, 3)]);
}

// --- UI ---

const VocabMode = {
  render(container) {
    container.innerHTML = `
      <section class="pane">
        <h2>Dictionary</h2>
        <div class="row">
          <input id="v-word" placeholder="French word or phrase">
          <button id="v-add">Add</button>
          <button id="v-train">Start training</button>
        </div>
        <p id="v-status" class="status"></p>
        <table id="v-list"></table>
      </section>
      <section class="pane" id="v-trainer" hidden></section>
    `;
    container.querySelector('#v-add').onclick = () => this.addWord(container);
    container.querySelector('#v-word').onkeydown = (e) => {
      if (e.key === 'Enter') this.addWord(container);
    };
    container.querySelector('#v-train').onclick = () => this.trainerSetup(container);
    this.list(container);
  },

  list(container) {
    const entries = Dictionary.getAll();
    const table = container.querySelector('#v-list');
    if (!entries.length) {
      table.innerHTML = '<tr><td>Dictionary is empty.</td></tr>';
      return;
    }
    table.innerHTML =
      '<tr><th>French</th><th>English</th><th>Russian</th><th></th></tr>' +
      entries
        .map(
          (e, i) =>
            `<tr><td>${esc(e.french)}</td><td>${esc(e.english)}</td><td>${esc(e.russian)}</td>` +
            `<td><button data-del="${i}">×</button></td></tr>`
        )
        .join('');
    table.querySelectorAll('[data-del]').forEach((b) => {
      b.onclick = () => {
        Dictionary.remove(entries[b.dataset.del].french);
        this.list(container);
      };
    });
  },

  async addWord(container) {
    const input = container.querySelector('#v-word');
    const status = container.querySelector('#v-status');
    const word = input.value.trim();
    if (!word) return;
    status.textContent = 'Translating…';
    try {
      Dictionary.add(await Translate.both(word));
      input.value = '';
      status.textContent = '';
      this.list(container);
    } catch (err) {
      status.textContent = 'Translation failed: ' + err.message;
    }
  },

  trainerSetup(container) {
    const entries = Dictionary.getAll();
    const pane = container.querySelector('#v-trainer');
    pane.hidden = false;
    if (!entries.length) {
      pane.innerHTML = '<p>Add some words first.</p>';
      return;
    }
    pane.innerHTML = `
      <h2>Flashcards</h2>
      <div class="row">
        <label>Cards
          <select id="t-type">
            <option value="fr">French → translation</option>
            <option value="tr">Translation → French</option>
            <option value="mix">Mixed</option>
          </select>
        </label>
        <label>Input
          <select id="t-input">
            <option value="write">Write-in</option>
            <option value="mc">Multiple choice</option>
          </select>
        </label>
        <button id="t-go">Go</button>
      </div>
      <div id="t-card"></div>
    `;
    pane.querySelector('#t-go').onclick = () =>
      this.nextCard(pane, {
        type: pane.querySelector('#t-type').value,
        input: pane.querySelector('#t-input').value,
        score: { right: 0, total: 0 },
      });
  },

  // Runs until the user stops — each answer just draws another card.
  nextCard(pane, state) {
    const all = Dictionary.getAll();
    const entry = all[Math.floor(Math.random() * all.length)];
    const card = makeCard(entry, state.type);
    const options = state.input === 'mc' ? mcOptions(card, all) : null;
    const box = pane.querySelector('#t-card');

    box.innerHTML = `
      <p class="score">${state.score.right}/${state.score.total}</p>
      <p class="prompt">${esc(card.prompt)}</p>
      ${
        options
          ? `<div class="row">${options
              .map((o, i) => `<button data-opt="${i}">${esc(o)}</button>`)
              .join('')}</div>`
          : `<div class="row"><input id="t-answer" autocomplete="off"><button id="t-check">Check</button></div>`
      }
      <p id="t-feedback"></p>
      <button id="t-stop">Stop</button>
    `;
    box.querySelector('#t-stop').onclick = () => this.trainerSetup(pane.parentElement);

    const grade = (value) => {
      const ok = isCorrect(card, value);
      state.score.total++;
      if (ok) state.score.right++;
      box.querySelector('#t-feedback').textContent = ok
        ? 'Correct.'
        : 'Answer: ' + card.reveal;
      setTimeout(() => this.nextCard(pane, state), ok ? 500 : 1600);
    };

    if (options) {
      box.querySelectorAll('[data-opt]').forEach((b) => {
        b.onclick = () => grade(options[b.dataset.opt]);
      });
    } else {
      const field = box.querySelector('#t-answer');
      field.focus();
      const check = () => grade(field.value);
      box.querySelector('#t-check').onclick = check;
      field.onkeydown = (e) => {
        if (e.key === 'Enter') check();
      };
    }
  },
};
