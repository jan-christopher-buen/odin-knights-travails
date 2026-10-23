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

test('rejects malformed positions in either argument', () => {
  const inherited = new Array(2);
  Object.setPrototypeOf(inherited, { 0: 0, 1: 0 });
  const malformed = [
    undefined, null, 3, '0,0', {}, { 0: 0, 1: 0, length: 2 },
    [], [0], [0, 0, 0], new Array(2), [0, ,], [, 0], inherited,
    [0.5, 0], [0, -0.5], ['0', 0], [0, '0'], [NaN, 0],
    [0, Infinity], [-Infinity, 0], [true, 0], [null, 0],
    [undefined, 0], [0n, 0], [Symbol('coordinate'), 0],
  ];
  for (const position of malformed) {
    assert.throws(() => knightMoves(position, [0, 0]), TypeError);
    assert.throws(() => knightMoves([0, 0], position), TypeError);
  }
  assert.throws(() => knightMoves(), TypeError);
  assert.throws(() => knightMoves([0, 0]), TypeError);
  for (const position of [[-1, 0], [8, 0], [0, -1], [0, 8]]) {
    assert.throws(() => knightMoves(position, [0, 0]), RangeError);
    assert.throws(() => knightMoves([0, 0], position), RangeError);
  }
});

test('preserves frozen inputs and returns independent coordinate arrays', () => {
  for (const [startValue, endValue, distance] of examples) {
    const start = Object.freeze([...startValue]);
    const end = Object.freeze([...endValue]);
    const path = knightMoves(start, end);
    assertPath(path, start, end, distance);
    assert.deepEqual(start, startValue);
    assert.deepEqual(end, endValue);
    for (const position of path) {
      assert.notStrictEqual(position, start);
      assert.notStrictEqual(position, end);
    }
    const repeated = knightMoves(start, end);
    assertPath(repeated, start, end, distance);
    assert.deepEqual(repeated, path);
    for (let index = 0; index < path.length; index += 1) {
      assert.notStrictEqual(path[index], repeated[index]);
    }
    path[0][0] = 99;
    assert.deepEqual(start, startValue);
    assert.deepEqual(end, endValue);
    assertPath(repeated, start, end, distance);
  }
});

test('matches independent all-pairs shortest distances for all 4,096 queries', () => {
  const squares = [];
  for (let x = 0; x < 8; x += 1) {
    for (let y = 0; y < 8; y += 1) squares.push([x, y]);
  }
  // Build explicit adjacency from coordinate differences, without production offsets.
  const distances = squares.map(([x, y], from) => (
    squares.map(([otherX, otherY], to) => {
      if (from === to) return 0;
      const dx = Math.abs(x - otherX);
      const dy = Math.abs(y - otherY);
      return (dx === 1 && dy === 2) || (dx === 2 && dy === 1) ? 1 : Infinity;
    })
  ));
  // Floyd–Warshall considers each square as an intermediate vertex.
  for (let via = 0; via < 64; via += 1) {
    for (let from = 0; from < 64; from += 1) {
      for (let to = 0; to < 64; to += 1) {
        distances[from][to] = Math.min(
          distances[from][to], distances[from][via] + distances[via][to],
        );
      }
    }
  }
  for (let from = 0; from < 64; from += 1) {
    for (let to = 0; to < 64; to += 1) {
      assertPath(knightMoves(squares[from], squares[to]),
        squares[from], squares[to], distances[from][to]);
    }
  }
});
