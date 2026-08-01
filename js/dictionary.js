// Dictionary storage, backed by localStorage. Entry: {french, english, russian, addedAt}

const Dictionary = {
  KEY: 'french_app_dict',

  getAll() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY)) || [];
    } catch {
      return [];
    }
  },

  save(list) {
    localStorage.setItem(this.KEY, JSON.stringify(list));
  },

  // Matching key for add/remove — must be the same on both sides, or a word
  // re-added with different casing becomes undeletable.
  key(french) {
    return (french || '').trim().toLowerCase();
  },

  // Dedupes on french text; re-adding a word refreshes its translations.
  add(entry) {
    const list = this.getAll();
    const i = list.findIndex((e) => this.key(e.french) === this.key(entry.french));
    if (i >= 0) list[i] = { ...list[i], ...entry };
    else list.push({ ...entry, addedAt: Date.now() });
    this.save(list);
    return list;
  },

  remove(french) {
    this.save(this.getAll().filter((e) => this.key(e.french) !== this.key(french)));
  },
};
