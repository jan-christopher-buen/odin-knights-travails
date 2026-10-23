import { knightMoves } from './knight-moves.js';

const examples = [
  [[0, 0], [1, 2]],
  [[0, 0], [3, 3]],
  [[3, 3], [0, 0]],
  [[0, 0], [7, 7]],
  [[3, 3], [4, 3]],
  [[3, 3], [3, 3]],
];

for (const [start, end] of examples) {
  const path = knightMoves(start, end);
  const moves = path.length - 1;
  console.log(`\n[${start.join(', ')}] to [${end.join(', ')}]`);
  console.log(`You made it in ${moves} ${moves === 1 ? 'move' : 'moves'}! Here's your path:`);
  for (const position of path) console.log(`[${position.join(', ')}]`);
}
