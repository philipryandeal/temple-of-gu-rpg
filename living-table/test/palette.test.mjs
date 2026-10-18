import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const official = new Set(['#495a58', '#303636', '#ff5e1f', '#ffffff']);
const sources = ['courtyard.css', 'style.css', 'human.html'];

test('Living Table UI uses exactly the Temple of Gu four official hex colors', async () => {
  for (const name of sources) {
    const source = await readFile(new URL('../' + name, import.meta.url), 'utf8');
    const colors = [...new Set((source.match(/#[0-9a-fA-F]{6}/g) || []).map(x => x.toLowerCase()))];
    assert.deepEqual(new Set(colors), official, name);
  }
});

test('courtyard artwork stays a separate layer; tokens and hotspots are HTML overlays', async () => {
  const html = await readFile(new URL('../courtyard.html', import.meta.url), 'utf8');
  assert.ok(html.includes('src="./courtyard.svg"'));
  assert.ok(html.includes('id="zones"'));
  assert.ok(html.includes('id="tokens"'));
  const css = await readFile(new URL('../courtyard.css', import.meta.url), 'utf8');
  assert.ok(css.includes('.token'));
  assert.ok(css.includes('.hotspot'));
});

test('desktop Field Journal expands to the bottom of the neighboring sidebar', async () => {
  const css = await readFile(new URL('../courtyard.css', import.meta.url), 'utf8');
  const desktop = css.match(/@media\s*\(min-width:\s*1101px\)\s*\{([\s\S]*?)\n\}/)?.[1];
  assert.ok(desktop, 'desktop alignment rule must exist');
  assert.match(desktop, /\.table-section\s*\{\s*display:\s*flex;\s*flex-direction:\s*column;/);
  assert.match(desktop, /\.field-journal\s*\{\s*display:\s*flex;\s*flex-direction:\s*column;\s*flex:\s*1 1 auto;/);
  assert.match(desktop, /#field-journal-notes\s*\{\s*flex:\s*1 1 auto;/);
});
