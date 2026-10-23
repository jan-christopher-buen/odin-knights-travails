const BOARD_SIZE = 8;
const MOVE_OFFSETS = [
  [2, 1], [1, 2], [-1, 2], [-2, 1],
  [-2, -1], [-1, -2], [1, -2], [2, -1],
];

function validatePosition(position, name) {
  if (!Array.isArray(position) || position.length !== 2
      || !Object.hasOwn(position, 0) || !Object.hasOwn(position, 1)
      || !Number.isInteger(position[0]) || !Number.isInteger(position[1])) {
    throw new TypeError(`${name} must contain exactly two integer coordinates.`);
  }
  if (position.some((coordinate) => coordinate < 0 || coordinate >= BOARD_SIZE)) {
    throw new RangeError(`${name} coordinates must be between 0 and 7.`);
  }
}

function reconstructPath(destination, parents) {
  const path = [];
  for (let square = destination; square !== null; square = parents.get(square)) {
    path.push([Math.floor(square / BOARD_SIZE), square % BOARD_SIZE]);
  }
  return path.reverse();
}

export function knightMoves(start, end) {
  validatePosition(start, 'start');
  validatePosition(end, 'end');

  const startId = start[0] * BOARD_SIZE + start[1];
  const endId = end[0] * BOARD_SIZE + end[1];
  const queue = [startId];
  // The parent map also tracks visited squares, starting when they are enqueued.
  const parents = new Map([[startId, null]]);

  for (let readIndex = 0; readIndex < queue.length; readIndex += 1) {
    const square = queue[readIndex];
    if (square === endId) return reconstructPath(endId, parents);

    const x = Math.floor(square / BOARD_SIZE);
    const y = square % BOARD_SIZE;
    for (const [dx, dy] of MOVE_OFFSETS) {
      const nextX = x + dx;
      const nextY = y + dy;
      if (nextX < 0 || nextX >= BOARD_SIZE || nextY < 0 || nextY >= BOARD_SIZE) {
        continue;
      }
      const nextId = nextX * BOARD_SIZE + nextY;
      if (parents.has(nextId)) continue;
      // FIFO exploration discovers each square at its shortest distance.
      parents.set(nextId, square);
      queue.push(nextId);
    }
  }

  // Every square on the standard board is reachable from every other square.
  throw new Error('No knight path found on the standard board.');
}
