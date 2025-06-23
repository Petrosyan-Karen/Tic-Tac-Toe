export function makeMove(squares, idx, player) {
  const next = squares.slice();
  next[idx] = player;
  return next;
}

export function getComputerMove(squares, level, computerMark, playerMark, size) {
  const empty = squares
    .map((v, i) => (v == null ? i : null))
    .filter(i => i != null);

  // Level 6: fallback to block/win or random for performance
  if (level === 6) {
    for (let idx of empty) {
      const test = squares.slice();
      test[idx] = computerMark;
      if (calculateWinner(test, size).winner === computerMark) return idx;
    }
    for (let idx of empty) {
      const test = squares.slice();
      test[idx] = playerMark;
      if (calculateWinner(test, size).winner === playerMark) return idx;
    }
    if (empty.includes(Math.floor(size * size / 2))) return Math.floor(size * size / 2);
    return empty[Math.floor(Math.random() * empty.length)];
  }

  // Level 2-5: try to win/block, otherwise random
  if (level >= 2) {
    for (let idx of empty) {
      const test = squares.slice();
      test[idx] = computerMark;
      if (calculateWinner(test, size).winner === computerMark) return idx;
    }
    for (let idx of empty) {
      const test = squares.slice();
      test[idx] = playerMark;
      if (calculateWinner(test, size).winner === playerMark) return idx;
    }
    if (level >= 3) {
      if (empty.includes(Math.floor(size * size / 2))) return Math.floor(size * size / 2);
      const corners = [0, size - 1, size * (size - 1), size * size - 1].filter(i => empty.includes(i));
      if (corners.length && Math.random() < 0.5 + 0.1 * (level - 3)) {
        return corners[Math.floor(Math.random() * corners.length)];
      }
    }
  }

  // Level 1: random
  return empty[Math.floor(Math.random() * empty.length)];
}

export function calculateWinner(squares, size) {
  const winLength = 4;
  const lines = [];

  // Rows
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - winLength; c++) {
      lines.push([...Array(winLength)].map((_, i) => r * size + c + i));
    }
  }
  // Columns
  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - winLength; r++) {
      lines.push([...Array(winLength)].map((_, i) => (r + i) * size + c));
    }
  }
  // Diagonals \
  for (let r = 0; r <= size - winLength; r++) {
    for (let c = 0; c <= size - winLength; c++) {
      lines.push([...Array(winLength)].map((_, i) => (r + i) * size + (c + i)));
    }
  }
  // Diagonals /
  for (let r = 0; r <= size - winLength; r++) {
    for (let c = winLength - 1; c < size; c++) {
      lines.push([...Array(winLength)].map((_, i) => (r + i) * size + (c - i)));
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (
      squares[line[0]] &&
      line.every(idx => squares[idx] === squares[line[0]])
    ) {
      return { winner: squares[line[0]], line };
    }
  }
  return { winner: null, line: null };
}