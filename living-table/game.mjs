// PR 1: pure browser movement and inspection rules. No casting, quests or persistent state.
export const SIZE = 7;
export const POTO = Object.freeze({ x: 3, y: 3 });
export const START = Object.freeze({ x: 3, y: 5 });
export function isInside(x, y) { return Number.isInteger(x) && Number.isInteger(y) && x >= 0 && y >= 0 && x < SIZE && y < SIZE; }
export function isBlocked(x, y) { return x === POTO.x && y === POTO.y; }
export function move(position, dx, dy) {
  if (!Number.isInteger(dx) || !Number.isInteger(dy) || Math.abs(dx) + Math.abs(dy) !== 1) return position;
  const x = position.x + dx, y = position.y + dy;
  return isInside(x, y) && !isBlocked(x, y) ? { x, y } : position;
}
export function stepToward(position, x, y) {
  if (!isInside(x, y)) return position;
  const dx = x - position.x, dy = y - position.y;
  if (Math.abs(dx) > Math.abs(dy)) return move(position, Math.sign(dx), 0);
  if (dy !== 0) return move(position, 0, Math.sign(dy));
  if (dx !== 0) return move(position, Math.sign(dx), 0);
  return position;
}
export function canInspect(position) { return Math.abs(position.x - POTO.x) + Math.abs(position.y - POTO.y) === 1; }
export const INSPECTION = 'The Poto Mitan stands at the center of the Temple peristyle. The Fèt gathers around this central place.';

// Keyboard movement keeps focus with the seeker only when initiated inside the grid.
export function focusAfterMovement(fromGrid, seekerPosition) { return fromGrid ? { ...seekerPosition } : null; }
