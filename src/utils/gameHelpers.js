export function makeMove(squares, idx, player) {
  const next = squares.slice();
  next[idx] = player;
  return next;
}

export function getComputerMove(squares, level, computerMark, playerMark) {
  const empty = squares
    .map((v, i) => (v == null ? i : null))
    .filter(i => i != null);

  if (level === 6) {
    return minimaxRoot(squares, computerMark, playerMark);
  }

  if (level >= 2) {
    for (let idx of empty) {
      const test = squares.slice();
      test[idx] = computerMark;
      if (calculateWinner(test).winner === computerMark) return idx;
    }
    for (let idx of empty) {
      const test = squares.slice();
      test[idx] = playerMark;
      if (calculateWinner(test).winner === playerMark) return idx;
    }
    if (level >= 3) {
      if (empty.includes(4)) return 4;
      const corners = [0, 2, 6, 8].filter(i => empty.includes(i));
      if (corners.length && Math.random() < 0.5 + 0.1 * (level - 3)) {
        return corners[Math.floor(Math.random() * corners.length)];
      }
    }
  }
  return empty[Math.floor(Math.random() * empty.length)];
}

export function minimaxRoot(squares, computerMark, playerMark) {
  let bestScore = -Infinity;
  let bestMove = null;
  for (let i = 0; i < 9; i++) {
    if (!squares[i]) {
      const newSquares = squares.slice();
      newSquares[i] = computerMark;
      const score = minimax(newSquares, 0, false, computerMark, playerMark);
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove;
}

export function minimax(squares, depth, isMaximizing, computerMark, playerMark) {
  const winnerObj = calculateWinner(squares);
  if (winnerObj.winner === computerMark) return 10 - depth;
  if (winnerObj.winner === playerMark) return depth - 10;
  if (squares.every(Boolean)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        squares[i] = computerMark;
        best = Math.max(best, minimax(squares, depth + 1, false, computerMark, playerMark));
        squares[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        squares[i] = playerMark;
        best = Math.min(best, minimax(squares, depth + 1, true, computerMark, playerMark));
        squares[i] = null;
      }
    }
    return best;
  }
}

export function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return { winner: null, line: null };
}