import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const rooms = (name) => readdirSync(resolve(root, name), { withFileTypes: true }).filter(x => x.isDirectory()).map(x => x.name);
test('Living Tree has ten stations and twenty-two paths', () => {
  assert.equal(rooms('stations').length, 10);
  assert.equal(rooms('paths').length, 22);
  for (const name of rooms('stations')) assert.ok(readFileSync(resolve(root, 'stations', name, 'index.html'), 'utf8').includes('<!doctype html>'));
  for (const name of rooms('paths')) assert.ok(readFileSync(resolve(root, 'paths', name, 'index.html'), 'utf8').includes('<!doctype html>'));
});
test('Living Tree uses a shared public map and excludes Daat', () => {
  const data = readFileSync(resolve(root, 'tree-data.js'), 'utf8');
  assert.ok(data.includes('export const stations'));
  assert.ok(data.includes('export const paths'));
  assert.doesNotMatch(data, /da['’]?at/i);
});
