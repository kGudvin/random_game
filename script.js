const cells = document.querySelectorAll('[data-cell]')
const statusDiv = document.getElementById('status')
const currentPlayerDiv = document.getElementById('current-player')
const xSound = document.getElementById('x-sound')
const oSound = document.getElementById('o-sound')
const winSound = document.getElementById('win-sound')
const resetButton = document.getElementById('reset-storage')
const resetGameButton = document.getElementById('reset-game')

let currentPlayer = 'X'
let gameBoard = Array(9).fill(null)
let isGameActive = true
let moveCount = 0

const winningCombinations = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
]

resetGameButton.addEventListener('click', resetGame)

cells.forEach((cell, index) => {
	cell.addEventListener('click', () => {
		if (!isGameActive || cell.textContent !== '') return

		cell.textContent = currentPlayer
		gameBoard[index] = currentPlayer
		moveCount++
		if (currentPlayer === 'X') {
			xSound.play()
		} else {
			oSound.play()
		}

		if (checkWin()) {
			winSound.play()
			statusDiv.textContent = `${currentPlayer} победил за ${moveCount} ходов!`
			saveGameResult(currentPlayer, moveCount)
			updateGameHistory()
			isGameActive = false
			setTimeout(resetGame, 2000)
		} else if (moveCount === 9) {
			statusDiv.textContent = 'Ничья!'
			saveGameResult('Ничья', moveCount)
			updateGameHistory()
			setTimeout(resetGame, 1000)
		} else {
			currentPlayer = currentPlayer === 'X' ? 'O' : 'X'
			updateCurrentPlayer()
		}
	})
})

function checkWin() {
	return winningCombinations.some(combination => {
		return combination.every(index => gameBoard[index] === currentPlayer)
	})
}

function saveGameResult(winner, moves) {
	const gameResults = JSON.parse(localStorage.getItem('gameResults')) || []
	gameResults.push({ winner, moves })
	if (gameResults.length > 10) gameResults.shift()
	localStorage.setItem('gameResults', JSON.stringify(gameResults))
}

function updateGameHistory() {
	const gameHistory = document.getElementById('game-history')
	const gameResults = JSON.parse(localStorage.getItem('gameResults')) || []

	gameHistory.innerHTML = gameResults
		.map(result => {
			return `<li>${result.winner} - ${result.moves} ходов</li>`
		})
		.join('')
}
function updateCurrentPlayer() {
	currentPlayerDiv.textContent = `Ходит: ${currentPlayer}`
}

resetButton.addEventListener('click', () => {
	localStorage.removeItem('gameResults')
	updateGameHistory()
})

function resetGame() {
	gameBoard = Array(9).fill(null)
	cells.forEach(cell => {
		cell.textContent = ''
	})
	currentPlayer = 'X'
	isGameActive = true
	moveCount = 0
	statusDiv.textContent = ''
	updateCurrentPlayer()
}
