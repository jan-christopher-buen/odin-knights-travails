# Knights Travails

Find one shortest legal knight path between any two squares on a standard chessboard. This dependency-free JavaScript console project implements [The Odin Project's Knights Travails assignment](https://www.theodinproject.com/lessons/javascript-knights-travails) using breadth-first search (BFS).

## Features

- Shortest paths including both endpoints, with deterministic results.
- Strict input validation and fresh output coordinates without modifying inputs.
- Six labeled console examples, including a zero-move route.
- Automated tests for invalid inputs, frozen arrays, independent results, and every possible start/destination pair.

## Run locally

Use Node.js 22 or later with npm. Verified locally with Node.js v24.22.0 and npm 11.19.1 on WSL2. There are no dependencies to install.

```sh
git clone git@github.com:jan-christopher-buen/odin-knights-travails.git
cd odin-knights-travails
npm start
npm test
```

Tests use `node:test` and `node:assert/strict`. An independent reference graph compares all board coordinates using the knight's absolute-difference movement rule. Floyd–Warshall computes all-pairs distances; tests check all 4,096 queries for minimal length, endpoints, board bounds, and legal transitions.

## API

```js
import { knightMoves } from './knight-moves.js';

const path = knightMoves([0, 0], [3, 3]);
// [[0, 0], [2, 1], [3, 3]]
const moves = path.length - 1; // 2
```

Positions use `[x, y]`: x increases horizontally and y vertically, with `[0, 0]` as the origin. Both coordinates are integers from 0 through 7. This convention does not assign chess algebraic labels to squares.

Both arguments are validated before searching. Malformed positions (including missing arguments, incorrect array lengths, sparse arrays, and non-integer or non-number coordinates) throw `TypeError`. Integer coordinates outside the board throw `RangeError`. Values are never coerced.

The function returns an array of fresh coordinate arrays and prints nothing. Input arrays are never modified, so frozen inputs work. Equal start and destination coordinates return a one-position path. Displayed move counts are always `path.length - 1`.

## How the search works

The board is an implicit, unweighted graph: 64 squares are vertices and legal knight moves are edges. Neighbors are generated dynamically instead of storing a graph. Square identity is encoded as `x * 8 + y`.

BFS processes a FIFO array queue using a moving read index. It explores squares in layers of increasing move count. Because every edge costs one move, the first discovery of a square has the smallest possible distance from the start.

A parent map records each square's predecessor and doubles as visited tracking. Squares are marked when enqueued, preventing duplicate exploration and cycles. Once the destination is reached, the algorithm follows predecessors back to the start and reverses that sequence once. It does not copy entire paths during exploration.

Multiple shortest routes can exist. The fixed offset order below breaks ties deterministically; reverse queries need not return the exact reversed route.

```text
[2, 1], [1, 2], [-1, 2], [-2, 1],
[-2, -1], [-1, -2], [1, -2], [2, -1]
```

For `[0, 0]` to `[3, 3]`, layer 0 contains the start. Layer 1 discovers `[2, 1]` and `[1, 2]`. Exploring `[2, 1]` discovers `[3, 3]` at layer 2. Following parents produces `[0, 0] → [2, 1] → [3, 3]`, a two-move path.

## Complexity and scope

General BFS takes O(V + E) time and O(V) auxiliary space. Reconstructing a path of L positions takes O(L) time and output space. Each square has at most eight neighbors, so E is at most 8V when counting directed connections.

This implementation supports only a fixed 8-by-8 board with 64 vertices, so its work and storage are bounded constants with respect to its inputs. The general graph analysis describes the algorithm; it does not imply support for arbitrary board sizes.

The project supports knight movement only, with no obstacles or other pieces. It returns one shortest path and provides a console demonstration without a GUI.

## Learning outcomes

The project practices implicit graph modeling, BFS layers, coordinate-based identity, predecessor reconstruction, and separating reusable logic from console presentation. Independent all-pairs verification checks shortest-path correctness without duplicating the production BFS algorithm.
