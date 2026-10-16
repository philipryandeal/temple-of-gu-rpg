// Published Temple of Gu Master Guidebook: 2d6 + one Virtue.
// This is a Lesson roll, NOT the separate Fá/Odù entrance casting.
export const VIRTUES = Object.freeze(['suuru','oye','foriti','iwa']);
export const STARTING_SCORES = Object.freeze([0,1,1,2]);
export function outcomeFor(total) {
  if (!Number.isInteger(total)) throw new TypeError('total must be an integer');
  if (total >= 10) return 'Full success';
  if (total >= 7) return 'Success with cost or challenges';
  return 'Lesson deferred';
}
export function evaluateLesson(dice, virtue, modifier) {
  if (!Array.isArray(dice) || dice.length !== 2 || !dice.every(d => Number.isInteger(d) && d >= 1 && d <= 6)) throw new RangeError('Two six-sided dice required');
  if (!VIRTUES.includes(virtue)) throw new RangeError('Unknown Virtue');
  if (!Number.isInteger(modifier) || modifier < 0 || modifier > 2) throw new RangeError('Invalid starting Virtue modifier');
  const total = dice[0] + dice[1] + modifier;
  return Object.freeze({dice:[...dice],virtue,modifier,total,outcome:outcomeFor(total)});
}
export function rollLesson(virtue,modifier) {
  const values = new Uint32Array(2);
  // Browser cryptographic RNG, no fallback to predictable Math.random.
  globalThis.crypto.getRandomValues(values);
  return evaluateLesson(Array.from(values, n => (n % 6) + 1),virtue,modifier);
}
