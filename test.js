// Self-check for the pure logic. Run: node test.js
const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const store = {};
const ctx = vm.createContext({
  localStorage: {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => (store[k] = String(v)),
  },
});
// `const` at the top of a script stays lexical, so run the files as one script
// and hand the bindings out explicitly.
const src = ['js/dictionary.js', 'js/vocab.js'].map((f) => fs.readFileSync(f, 'utf8')).join('\n');
const { Dictionary, makeCard, isCorrect, mcOptions } = vm.runInContext(
  src + '\n;({ Dictionary, makeCard, isCorrect, mcOptions });',
  ctx
);

const chat = { french: 'le chat', english: 'the cat', russian: 'кот' };

// card directions
assert.equal(makeCard(chat, 'fr').prompt, 'le chat');
assert.deepEqual(makeCard(chat, 'fr').answers, ['the cat', 'кот']);
assert.equal(makeCard(chat, 'tr').prompt, 'the cat / кот');
assert.deepEqual(makeCard(chat, 'tr').answers, ['le chat']);
assert.ok(['fr', 'tr'].includes(makeCard(chat, 'mix').dir));

// grading is accent-, case- and punctuation-insensitive; either language counts
const fr = makeCard(chat, 'fr');
assert.ok(isCorrect(fr, 'The Cat!'));
assert.ok(isCorrect(fr, 'кот'));
assert.ok(!isCorrect(fr, 'the dog'));
assert.ok(isCorrect(makeCard({ french: 'été', english: 'summer' }, 'tr'), 'ETE'));

// multiple choice: needs 3 distractors, always contains the answer
assert.equal(mcOptions(fr, [chat]), null);
const all = [chat, { french: 'le chien', english: 'the dog' }, { french: 'la maison', english: 'the house' }, { french: 'le pain', english: 'the bread' }];
const opts = mcOptions(makeCard(all[0], 'fr'), all);
assert.equal(opts.length, 4);
assert.ok(opts.includes('the cat'));
assert.equal(new Set(opts).size, 4);

// dictionary dedupes on french and survives a round trip
Dictionary.add(chat);
Dictionary.add({ french: 'Le Chat', english: 'cat', russian: 'кошка' });
assert.equal(Dictionary.getAll().length, 1);
assert.equal(Dictionary.getAll()[0].english, 'cat');
Dictionary.remove('le chat');
assert.equal(Dictionary.getAll().length, 0);

console.log('ok');
