// LibreTranslate wrapper. Public instances come and go and some now require a
// key, so the endpoint + key live in localStorage and are editable in the UI.
// Self-host fallback: docker run -p 5000:5000 libretranslate/libretranslate

// Verified public instances (no API key needed): argosopentech.com is the
// project's own documented default. terraprint.co is the fallback if it's
// ever down. Full list: https://github.com/LibreTranslate/LibreTranslate#mirrors
const LT_DEFAULT = 'https://translate.argosopentech.com';

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

    const res = await fetch(this.url() + '/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
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
