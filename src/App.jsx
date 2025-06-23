import { useState, useEffect } from 'react';
import Board from './components/Board';
import Message from './components/Message';
import {
  makeMove,
  getComputerMove,
  calculateWinner
} from './utils/gameHelpers';
import styles from './styles/app.module.css';

export default function App() {
  const size = 5;
  const totalSquares = size * size;

  function getRandomMarksAndTurn() {
    const humanIsX = Math.random() < 0.5;
    return {
      playerMark: humanIsX ? 'X' : 'O',
      computerMark: humanIsX ? 'O' : 'X',
    };
  }

  const [{ playerMark, computerMark }, setRoles] = useState(getRandomMarksAndTurn());
  const [history, setHistory] = useState([{ squares: Array(totalSquares).fill(null), moveLoc: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [asc, setAsc] = useState(true);
  const [level, setLevel] = useState(1);
  const [lossStreak, setLossStreak] = useState(0);
  const [message, setMessage] = useState("");

  const xIsNext = currentMove % 2 === 0;
  const current = history[currentMove];
  const winnerObj = calculateWinner(current.squares, size);

  useEffect(() => {
    if (!winnerObj.winner && !current.squares.every(Boolean)) {
      const computerTurn = (xIsNext && computerMark === 'X') || (!xIsNext && computerMark === 'O');
      if (computerTurn) {
        setTimeout(() => {
          const move = getComputerMove(current.squares, level, computerMark, playerMark, size);
          handlePlay(makeMove(current.squares, move, computerMark), move);
        }, 1500);
      }
    }
    // eslint-disable-next-line
  }, [xIsNext, currentMove, computerMark, playerMark]);

  function showMessage(msg) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 1500);
  }

  function handlePlay(nextSquares, moveIdx) {
    const nextHistory = [...history.slice(0, currentMove + 1), { squares: nextSquares, moveLoc: moveIdx }];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    const winner = calculateWinner(nextSquares, size).winner;
    if (winner || nextSquares.every(Boolean)) {
      setTimeout(() => {
        if (winner === playerMark) {
          setLevel(l => Math.min(6, l + 1));
          setLossStreak(0);
          showMessage('You win! Level up!');
        } else if (winner === computerMark) {
          setLossStreak(s => {
            if (s + 1 >= 3) {
              setLevel(1);
              showMessage('You lost 3 times in a row. Back to level 1!');
              return 0;
            }
            showMessage('You lost!');
            return s + 1;
          });
        } else {
          setLossStreak(0);
          showMessage('Draw!');
        }
        const newRoles = getRandomMarksAndTurn();
        setRoles(newRoles);
        setHistory([{ squares: Array(totalSquares).fill(null), moveLoc: null }]);
        setCurrentMove(0);
      }, 100);
    }
  }

  function jumpTo(move) {
    if (move === 0) {
      const newRoles = getRandomMarksAndTurn();
      setRoles(newRoles);
      setHistory([{ squares: Array(totalSquares).fill(null), moveLoc: null }]);
      setCurrentMove(0);
    } else {
      setCurrentMove(move);
    }
  }

  function getMoveLocation(idx) {
    if (idx == null) return null;
    const row = Math.floor(idx / size) + 1;
    const col = (idx % size) + 1;
    return `(${row}, ${col})`;
  }

  let moves = history.map((step, move) => {
    let desc;
    if (move === currentMove) {
      desc = <b>You are at move #{move} {move ? getMoveLocation(step.moveLoc) : ""}</b>;
    } else {
      desc = move ? `Go to move #${move} ${getMoveLocation(step.moveLoc)}` : 'Go to game start';
    }
    return (
      <li key={move}>
        {move === currentMove ? desc : <button onClick={() => jumpTo(move)}>{desc}</button>}
      </li>
    );
  });

  if (!asc) moves = moves.slice().reverse();

  return (
    <div className={styles.game}>
      <Message message={message} />
      <div className={styles.gameBoard}>
        <Board
          xIsNext={xIsNext}
          squares={current.squares}
          onPlay={handlePlay}
          winningLine={winnerObj.line}
          playerMark={playerMark}
          computerMark={computerMark}
          size={size}
        />
      </div>
      <div className={styles.gameInfo}>
        <div>
          You are <b>{playerMark}</b>, Computer is <b>{computerMark}</b>
        </div>
        <div>Level: {level}</div>
        <button onClick={() => setAsc(!asc)}>
          Sort {asc ? "Descending" : "Ascending"}
        </button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}