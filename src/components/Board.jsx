import Square from './Square';
import styles from '../styles/board.module.css';
import { calculateWinner } from '../utils/gameHelpers';

export default function Board({ xIsNext, squares, onPlay, winningLine, playerMark, computerMark, size }) {
  const playerTurn = (xIsNext && playerMark === 'X') || (!xIsNext && playerMark === 'O');

  function handleClick(i) {
    if (!playerTurn) return;
    if (calculateWinner(squares, size).winner || squares[i]) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares, i);
  }

  const boardRows = [];
  for (let row = 0; row < size; row++) {
    const squaresRow = [];
    for (let col = 0; col < size; col++) {
      const idx = row * size + col;
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

  const winnerObj = calculateWinner(squares, size);
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