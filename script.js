let board = Array(9).fill(0); // 0 = leer, 1 = X, 2 = O
let currentPlayer = "X"; // "X" für Kreuz, "O" für Kreis
const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function generateCircleSVG() {
  return `
    <svg width="70" height="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="none" stroke="#00aaff" stroke-width="5" 
        stroke-dasharray="314" stroke-dashoffset="0">
        <animate attributeName="stroke-dasharray" from="0 314" to="314 0" dur="0.2s" fill="freeze" />
      </circle>
    </svg>
  `;
}

function generateCrossSVG() {
  return `
    <svg width="70" height="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="20" x2="80" y2="80" stroke="#ffcc00" stroke-width="5" 
        stroke-dasharray="200" stroke-dashoffset="0">
        <animate attributeName="stroke-dasharray" from="0 200" to="200 0" dur="0.2s" fill="freeze" />
      </line>
      <line x1="80" y1="20" x2="20" y2="80" stroke="#ffcc00" stroke-width="5" 
        stroke-dasharray="200" stroke-dashoffset="0">
        <animate attributeName="stroke-dasharray" from="0 200" to="200 0" dur="0.2s" fill="freeze" />
      </line>
    </svg>
  `;
}

function checkWinner() {
  for (const [a, b, c] of winningCombinations) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return [a, b, c];
  }
  return null;
}

function drawWinningLine([a, b, c]) {
  const cells = document.querySelectorAll("td");
  const [start, end] = [cells[a].getBoundingClientRect(), cells[c].getBoundingClientRect()];
  const contentRect = document.getElementById("content").getBoundingClientRect();
  const line = document.createElement("div");
  positionLine(line, start, end, contentRect);
  document.getElementById("content").appendChild(line);
}

function positionLine(line, start, end, contentRect) {
  const x1 = start.left + start.width / 2 - contentRect.left;
  const y1 = start.top + start.height / 2 - contentRect.top;
  const x2 = end.left + end.width / 2 - contentRect.left;
  const y2 = end.top + end.height / 2 - contentRect.top;
  const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
  Object.assign(line.style, {
    position: "absolute", backgroundColor: "white", height: "5px",
    width: `${length}px`, transform: `rotate(${angle}deg)`,
    left: `${x1}px`, top: `${y1}px`, transformOrigin: "top left"
  });
}

function handleClick(index) {
  if (board[index]) return;
  board[index] = currentPlayer === "X" ? 1 : 2;
  updateCell(index, currentPlayer === "X" ? generateCrossSVG() : generateCircleSVG());
  const winnerCombo = checkWinner();
  if (winnerCombo) return drawWinningLine(winnerCombo);
  switchPlayer();
}

function updateCell(index, content) {
  const cell = document.querySelectorAll("td")[index];
  cell.innerHTML = content;
  cell.classList.add("taken");
}

function switchPlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  document.getElementById("currentPlayer").textContent = currentPlayer;
}

function render() {
  const container = document.getElementById("content");
  container.innerHTML = generateTable();
  document.getElementById("currentPlayer").textContent = currentPlayer;
}

function generateTable() {
  return "<table>" + Array(3).fill(0).map((_, row) =>
    "<tr>" + Array(3).fill(0).map((_, col) =>
      `<td onclick="handleClick(${row * 3 + col})"></td>`).join("") + "</tr>"
  ).join("") + "</table>";
}

function resetGame() {
  board.fill(0);
  currentPlayer = "X";
  document.querySelectorAll(".winning-line").forEach(line => line.remove());
  render();
}

function init() {
  render();
}