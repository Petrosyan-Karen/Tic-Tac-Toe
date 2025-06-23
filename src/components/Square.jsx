import styles from '../styles/square.module.css';

export default function Square({ value, onSquareClick, highlight }) {
  return (
    <button
      className={`${styles.square}${highlight ? ' ' + styles.highlight : ''}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}