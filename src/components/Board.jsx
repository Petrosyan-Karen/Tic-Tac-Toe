import Square from './Square';
import styles from '../styles/board.module.css';
import { calculateWinner } from '../utils/gameHelpers';

export default function Board({ xIsNext, squares, onPlay, winningLine, playerMark, computerMark }) {
  const playerTurn = (xIsNext && playerMark === 'X') || (!xIsNext && playerMark === 'O');
  function handleClick(i) {
    if (!playerTurn) return;
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares, i);
  }

  const boardRows = [];
  for (let row = 0; row < 3; row++) {
    const squaresRow = [];
    for (let col = 0; col < 3; col++) {
      const idx = row * 3 + col;
      squaresRow.push(
        <Square
          key={idx}
          value={squares[idx]}
          onSquareClick={() => handleClick(idx)}
          highlight={winningLine && winningLine.includes(idx)}
        />
      );
    }
    boardRows.push(
      <div className={styles.boardRow} key={row}>
        {squaresRow}
      </div>
    );
  }

  const winnerObj = calculateWinner(squares);
  let status;
  if (winnerObj.winner) {
    status = 'Winner: ' + winnerObj.winner + (winnerObj.winner === playerMark ? " (You)" : " (Computer)");
  } else if (squares.every(Boolean)) {
    status = 'Draw!';
  } else {
    status = 'Next player: ' + (xIsNext === (playerMark === 'X') ? `${playerMark} (You)` : `${computerMark} (Computer)`);
  }

  return (
    <>
      <div className={styles.status}>{status}</div>
      {boardRows}
    </>
  );
}