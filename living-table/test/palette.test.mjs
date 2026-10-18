import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const official = new Set(['#495a58', '#303636', '#ff5e1f', '#ffffff']);
const sources = ['courtyard.css', 'style.css', 'human.html'];

test('Living Table UI uses exactly the Temple of Gu four official hex colors', async () => {
  for (const name of sources) {
    const source = await readFile(new URL('../' + name, import.meta.url), 'utf8');
    const colors = [...new Set((source.match(/#[0-9a-fA-F]{6}\\b/g) || []).map(x => x.toLowerCase()))];
    assert.deepEqual(new Set(colors), official, name);
  }
});

test('courtyard artwork stays a separate layer; tokens and hotspots are HTML overlays', async () => {
  const html = await readFile(new URL('../courtyard.html', import.meta.url), 'utf8');
  assert.match(html, /<img src="\\.\\/courtyard\\.svg"/);
  assert.match(html, /id="zones"/);
  assert.match(html, /id="tokens"/);
  const css = await readFile(new URL('../courtyard.css', import.meta.url), 'utf8');
  assert.match(css, /\\.token/);
  assert.match(css, /\\.hotspot/);
});
