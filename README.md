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
Working MVP. Reading and Vocab modes are implemented; Grammar is a placeholder.
See `docs/spec.md` for the full spec.

Translation goes through a public **LibreTranslate** instance. Public instances
move around and some require a free API key, so the endpoint and key are
editable under **Settings** in the app. To run your own with no limits:

```
docker run -ti --rm -p 5000:5000 libretranslate/libretranslate
```

then set the URL to `http://localhost:5000`.

Reading mode fetches URLs through `r.jina.ai`, which handles CORS and article
extraction in one request. If a page won't load, paste the text instead.

## Install
```
git clone https://github.com/alibekk93/French-app.git
cd French-app
```
No build step, no dependencies. Open `index.html` in a browser, or serve it
statically:

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
test.js               self-check for the pure logic: node test.js
```

## License
MIT — see `LICENSE`.
