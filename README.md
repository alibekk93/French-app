# French App

A lightweight tool for improving French reading, vocabulary, and grammar.

## Goals
- Improve reading, vocabulary, grammar, and general level in French.
- Stay simplistic, minimalistic, lightweight.
- No internal LLM / agentic AI use.

## Modes
1. **Reading** — load text from a URL or pasted plain text; select any word or
   phrase to get an English + Russian translation in a popup; save selections
   to the dictionary.
2. **Vocab** — manage the dictionary (add words/phrases, auto-translated to
   English + Russian); flashcard trainer with configurable card direction
   (French-hidden / translation-hidden / mixed) and input type (write-in /
   4-option multiple choice), runs until the user stops.
3. **Grammar** — placeholder for now, implemented later.

## Translation
Uses a lightweight external translation tool/API (online connection allowed
when needed). Must be free — usage limits are fine, but no payment method
should be required.

## Status
Template only. Nothing is implemented yet — see `docs/spec.md` for the full
spec and the `js/` stubs for where each piece will live.

## Dev setup
No build step. Open `index.html` directly, or serve the folder statically:

```
python3 -m http.server 8000
```

## Structure
```
index.html          entry point / mode switcher shell
css/style.css        styles
js/app.js            mode switching, bootstraps the app
js/reading.js         reading mode
js/vocab.js           vocab mode + flashcard trainer
js/grammar.js         grammar mode (placeholder)
js/translate.js       translation API wrapper
js/dictionary.js      dictionary storage (localStorage)
docs/spec.md          full project spec (source of truth)
```

## License
MIT — see `LICENSE`.
