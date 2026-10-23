import test from 'node:test';
import assert from 'node:assert/strict';
import { knightMoves } from './knight-moves.js';

function assertPath(path, start, end, distance) {
  assert.deepEqual(path[0], start);
  assert.deepEqual(path.at(-1), end);
  assert.equal(path.length - 1, distance);
  for (const position of path) {
    assert.ok(Array.isArray(position));
    assert.equal(position.length, 2);
    for (const coordinate of position) {
      assert.ok(Number.isInteger(coordinate) && coordinate >= 0 && coordinate < 8);
    }
  }
  for (let index = 1; index < path.length; index += 1) {
    const dx = Math.abs(path[index][0] - path[index - 1][0]);
    const dy = Math.abs(path[index][1] - path[index - 1][1]);
    assert.ok((dx === 1 && dy === 2) || (dx === 2 && dy === 1));
  }
}

const examples = [
  [[0, 0], [0, 0], 0],
  [[0, 0], [1, 2], 1],
  [[0, 0], [3, 3], 2],
  [[3, 3], [0, 0], 2],
  [[0, 0], [7, 7], 6],
  [[3, 3], [4, 3], 3],
  [[0, 0], [1, 1], 4],
];

for (const [start, end, distance] of examples) {
  test(`${start} to ${end} takes ${distance} moves`, () => {
    assertPath(knightMoves(start, end), start, end, distance);
  });
}

test('validates both positions, including an equal start and end', () => {
  assert.throws(() => knightMoves([0, 0], [0, '0']), TypeError);
  assert.throws(() => knightMoves([-1, 0], [0, 0]), RangeError);
  assert.throws(() => knightMoves([0, 0], [8, 0]), RangeError);
});
