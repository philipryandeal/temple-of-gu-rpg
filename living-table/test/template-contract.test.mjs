import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

// Design-contract checks: guard the common tabletop shell while allowing a new
// scene to swap its artwork, scene number, narrative and inspectable objects.
const read = name => readFile(new URL('../' + name, import.meta.url), 'utf8');

test('approved Scene 01 shell retains slim heading, exactly three actions and footer navigation', async () => {
  const html = await read('courtyard.html');
  const header = html.split('<header class="mast">')[1]?.split('</header>')[0];
  const footer = html.split('<footer>')[1]?.split('</footer>')[0];
  assert.ok(header && footer, 'founder-approved header and footer');
  assert.match(header, /<h1>Scene\s+\d+:\s+[^<]+<\/h1>/);
  assert.equal((header.match(/<button\b/g) || []).length, 2, 'Reset and Export are buttons');
  for (const id of ['reset', 'export', 'import']) assert.ok(header.includes('id="' + id + '"'), id);
  assert.ok(header.includes('Import session'), 'Import stays a labeled control');
  assert.ok(!header.includes('Choose a scene'), 'return link belongs in footer');
  assert.ok(!header.includes('<p'), 'no tall kicker or subtitle in compact header');
  assert.ok(footer.includes('href="./index.html"') && footer.includes('Choose a scene'));
  const css = await read('courtyard.css');
  assert.match(footer, /<nav class="footer-links"[^>]*><a href="\.\/index\.html">← Choose a scene<\/a><span>or<\/span><a href="[^"]+">Read the rules<\/a><\/nav>/,
    'the two footer links and connecting word share one navigation row');
  assert.ok(footer.includes('https://github.com/philipryandeal/temple-of-gu-rpg/blob/main/guidebook/README.md'),
    'original rules remain reachable');
  assert.doesNotMatch(footer, /Local browser tabletop proof of concept|Not a live campaign room|Scene details remain proposed/,
    'retired prototype disclaimer is not displayed');
  assert.match(css, /\.footer-links\s*\{[^}]*display:\s*flex;[^}]*white-space:\s*nowrap;/,
    'footer links stay horizontally aligned');
});

test('scene illustration, interactive layers and full-width Field Journal remain in approved order', async () => {
  const html = await read('courtyard.html');
  const board = html.indexOf('id="board"');
  const zones = html.indexOf('id="zones"');
  const tokens = html.indexOf('id="tokens"');
  const journal = html.indexOf('class="field-journal"');
  const textarea = html.indexOf('id="field-journal-notes"');
  const sidebar = html.indexOf('class="sidebar"');
  assert.ok(board >= 0 && board < zones && zones < tokens && tokens < journal && journal < textarea && textarea < sidebar,
    'board artwork and interactive layers precede writing desk, then sidebar');
  assert.match(html, /<section class="table-section"[^>]*>\s*<div class="board-frame" id="frame">/,
    'orange-framed board follows the main heading with no banner in between');
  assert.doesNotMatch(html, /THE FÈT IS GATHERING|Original Temple of Gu Second Edition rules · No grid required|class="banner"/,
    'retired Courtyard lip and its explanatory copy stay removed');
  assert.ok(html.includes('<img src="./courtyard.svg"'), 'Scene 01 has its own illustration');
  assert.ok(html.includes('id="roll"') && html.includes('id="seeker-select"'), 'dice and Seeker selection remain available');
  assert.ok(html.includes('id="info-title"') && html.includes('id="solo"'), 'Guide and exploration prompts remain available');
});

test('layout geometry and journal sizing are protected across desktop and phone', async () => {
  const css = await read('courtyard.css');
  assert.match(css, /\.mast h1\s*\{[^}]*font-size:\s*clamp\(1\.45rem,\s*2\.4vw,\s*2\.2rem\)/);
  assert.match(css, /\.layout\s*\{[^}]*grid-template-columns:\s*minmax\(0,1fr\)\s+minmax\(270px,330px\)/);
  assert.match(css, /\.board\s*\{[^}]*aspect-ratio:\s*4\/3/);
  assert.doesNotMatch(css, /\.banner\s*\{/, 'removed lip styling is not reintroduced');
  assert.match(css, /\.board img\s*\{[^}]*pointer-events:\s*none/);
  assert.match(css, /\.hotspot,\s*\.token\s*\{[^}]*position:\s*absolute/);
  assert.match(css, /@media\(max-width:1100px\)/);
  assert.match(css, /@media\(max-width:600px\)/);
  assert.match(css, /@media\s*\(min-width:1101px\)\s*\{[\s\S]*?\.table-section\s*\{\s*display:\s*flex;[\s\S]*?\.field-journal\s*\{\s*display:\s*flex;\s*flex-direction:\s*column;\s*flex:\s*1 1 auto;[\s\S]*?#field-journal-notes\s*\{\s*flex:\s*1 1 auto;/);
  assert.match(css, /#field-journal-notes\s*\{[^}]*min-height:\s*340px/);
});

test('player-operated controls and local journal/portable save stay intact', async () => {
  const ui = await read('courtyard-ui.mjs');
  const state = await read('courtyard-state.mjs');
  assert.ok(ui.includes("b.addEventListener('pointermove'"), 'tokens remain player-draggable');
  assert.ok(ui.includes("document.querySelectorAll('[data-move]')"), 'alternate movement buttons remain');
  assert.ok(ui.includes("localStorage.setItem(JOURNAL_KEY,table.journal)"), 'notes remain on this browser');
  assert.ok(ui.includes("restoreJournalFromBrowser()"), 'notes restore from this browser');
  assert.ok(ui.includes("JSON.stringify(table,null,2)"), 'session export remains portable');
  assert.ok(ui.includes("parseTable(JSON.parse(await f.text()))"), 'session import remains validated');
  assert.ok(ui.includes("recordRoll(table,selected,v,result)"), 'rules-based dice rolls remain');
  assert.ok(state.includes('export const MAX_SEATS = 6;'), 'six-player published maximum is preserved');
  assert.doesNotMatch(ui, /new\s+WebSocket\s*\(|RTCPeerConnection\s*\(/, 'current personal table is not an online sync client');
});

test('documented personal-tabletop direction includes implemented Seeker-count control', async () => {
  const canon = await read('TEMPLATE-CANON.md');
  assert.match(canon, /independently operated boards/i);
  assert.match(canon, /1–6 player seats/);
  assert.match(canon, /player-count control is implemented/i);
  assert.match(canon, /not a.*immutable lock/i);
});

test('double-click fullscreen keeps the approved 4:3 map and interactive board together', async () => {
  const html = await read('courtyard.html');
  const ui = await read('courtyard-ui.mjs');
  const css = await read('courtyard.css');
  assert.doesNotMatch(html, /Double-click the map|Artwork is proposed for founder review|class="under"/, 'retired instructions stay removed');
  assert.match(css, /\.board-frame\s*\{[^}]*border:\s*3px solid var\(--temple-accent\)/, 'orange board frame remains');
  assert.match(ui, /board\.addEventListener\('dblclick'/);
  assert.match(ui, /board\.addEventListener\('pointerup'/, 'touch double-tap fallback remains');
  assert.match(ui, /isBareBoard\(event\.target\)/, 'game piece and zone button clicks are not fullscreen gestures');
  assert.match(ui, /document\.fullscreenElement === boardFrame/);
  assert.match(ui, /document\.exitFullscreen\(\)/);
  assert.match(ui, /boardFrame\.requestFullscreen\(\)/);
  // The 4:3 board fills the available play space beside (or above) the control bar.
  assert.match(css, /\.board-frame:fullscreen, \.board-frame\.is-pseudo-fullscreen \{[^}]*display:\s*grid/);
  assert.match(css, /\.board-frame:fullscreen \.board, \.board-frame\.is-pseudo-fullscreen \.board \{[^}]*max-width:\s*133\.33333vh;[^}]*aspect-ratio:\s*4 \/ 3/);
  assert.match(css, /\.board-frame:fullscreen \.board img, \.board-frame\.is-pseudo-fullscreen \.board img \{[^}]*object-fit:\s*fill/);
  assert.match(html, /<div id="zones"><\/div><div id="tokens"><\/div>/, 'both interactions remain on the live board');
});

test('Scene Journal, Seeker dice, and sample Seekers appear in founder-requested order', async () => {
  const html = await read('courtyard.html');
  const sidebar = html.split('<aside class="sidebar">')[1]?.split('</aside>')[0];
  assert.ok(sidebar, 'scene sidebar exists');
  const titles = ['SCENE JOURNAL', "THE SEEKER'S DICE", 'YOUR SAMPLE SEEKERS'];
  const locations = titles.map(title => sidebar.indexOf('>' + title + '<'));
  assert.ok(locations.every(position => position >= 0), 'all three panels are still present');
  assert.ok(locations[0] < locations[1] && locations[1] < locations[2],
    'dice follow the scene journal, before sample Seekers');
  assert.ok(!sidebar.includes('GUIDE CONTROLS · LOCAL ONLY'), 'founder-retired Guide Controls box is absent');
  assert.ok(!html.includes('id="reveal"') && !html.includes('id="clue"'), 'former reveal controls are absent');
  const ui = await read('courtyard-ui.mjs');
  assert.ok(!ui.includes("$('#reveal')") && !ui.includes("$('#clue')"), 'script has no missing-element listeners');
});
