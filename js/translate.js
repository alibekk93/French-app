// LibreTranslate wrapper. Public instances come and go and some now require a
// key, so the endpoint + key live in localStorage and are editable in the UI.
// Self-host fallback: docker run -p 5000:5000 libretranslate/libretranslate

// Defaults to a local LibreTranslate (Argos Translate under the hood):
//   pip install libretranslate && libretranslate --load-only en,fr,ru
// Public instances are unreliable and mostly key-gated now; point the URL at
// one under Settings if you'd rather not run your own.
const LT_DEFAULT = 'http://localhost:5000';

const Translate = {
  url() {
    return (localStorage.getItem('lt_url') || LT_DEFAULT).replace(/\/$/, '');
  },
  key() {
    return localStorage.getItem('lt_key') || '';
  },
  setConfig(url, key) {
    localStorage.setItem('lt_url', url || LT_DEFAULT);
    localStorage.setItem('lt_key', key || '');
  },

  async translate(text, target) {
    const body = { q: text, source: 'fr', target, format: 'text' };
    if (this.key()) body.api_key = this.key();

    let res;
    try {
      res = await fetch(this.url() + '/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch {
      // fetch only throws for network-level failures, which here almost always
      // means nothing is listening on the configured URL.
      throw new Error('cannot reach ' + this.url() + ' — is LibreTranslate running?');
    }
    if (!res.ok) throw new Error('translate ' + res.status + ' from ' + this.url());
    return (await res.json()).translatedText;
  },

  // French -> {french, english, russian}
  async both(text) {
    const [english, russian] = await Promise.all([
      this.translate(text, 'en'),
      this.translate(text, 'ru'),
    ]);
    return { french: text, english, russian };
  },
};
