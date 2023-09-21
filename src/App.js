import { useState } from 'react';

const BOARD_LENGTH = 7;
const BOARD_HEIGHT = 6;
const NUM_CELLS = BOARD_LENGTH * BOARD_HEIGHT;

function Cell({ value, onCellClick }) {
    let classes = "float-left rounded-full h-8 w-8 m-1 text-xs";
    if (value && value.startsWith("1")) {
        classes += " bg-red-600";
    } else if (value && value.startsWith("2")) {
        classes += " bg-yellow-400";
    } else {
        classes += " bg-white";
    }
    if (value && value.endsWith("WC")) {
        classes += " animate-highlight"; 
    }
    return (
        <div className={classes} onClick={onCellClick}>
        </div>
    );
}

function Board({ cells, isPlayerTurn, onPlay }) {

    function handleCellClick(index) {
        if (cells[index]) {
            return;
        }
        if (index + BOARD_LENGTH < NUM_CELLS && cells[index + BOARD_LENGTH] == null) {
            console.log("illegal move");
            return;
        }
        const nextCells = cells.slice();
        if (isPlayerTurn) {
            nextCells[index] = '1';
        } else {
            nextCells[index] = '2';
        }
        onPlay(nextCells, index);
    }

    return (
        Array.from({ length: BOARD_HEIGHT }).map((_, i) => (
            <div key={"row" + i}>
                {Array.from( {length: BOARD_LENGTH }).map((_, j) => (
                    <Cell key={i*BOARD_LENGTH+j} value={cells[i*BOARD_LENGTH+j]} onCellClick={() => handleCellClick(i*BOARD_LENGTH+j)} />
                ))}
            </div>
        ))
    );
}

export default function Game() {
    const [cells, setCells] = useState(Array(BOARD_LENGTH * BOARD_HEIGHT).fill(null));
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [gameOver, setGameOver] = useState(false);
    const [status, setStatus] = useState("");
    const [resetText, setResetText] = useState("Restart Game");

    function handlePlay(cells, lastMoveIndex) {
        if (gameOver) {
            return;
        }
        const winner = checkForWinner(cells, lastMoveIndex);
        if (winner) {
            for (let i = 0; i < winner.length; i++) {
                cells[winner[i]] += "WC";
            }
            if (cells[winner[0]].startsWith("1")) {
                setStatus("Red won the game!");
            } else {
                setStatus("Yellow won the game!");
            }
            setResetText("Play Again");
            setGameOver(true);
        } 
        setCells(cells);
        setIsPlayerTurn(!isPlayerTurn);
    }

    function handleRestartClick() {
        setCells(Array(BOARD_LENGTH * BOARD_HEIGHT).fill(null));
        setGameOver(false);
        setIsPlayerTurn(true);
        setResetText("Restart Game");
        setStatus("");
    }

    return (
        <>
            <div className='container'>
                <h1 className="text-2xl font-bold text-gray-900 leading-7 sm:truncate sm:text-3xl sm:tracking-tight text-left ml-8 mt-6">Connect 4</h1>
                <div className='container inline-block'>
                    <button className="float-left text-xs rounded-lg border-8 text-white bg-indigo-500 border-indigo-500 m-8" onClick={handleRestartClick}>
                        {resetText}
                    </button>
                    <p className='float-left my-8 mx-8 text-xs border-8 border-transparent'>{status}</p>
                </div>
            </div>
            <div>
                <div className="inline-block rounded-lg bg-indigo-500 mt-2 mx-8 mb-0">
                    <Board cells={cells} isPlayerTurn={isPlayerTurn} onPlay={handlePlay} />
                </div>
            </div>
        </>
    );
}

function checkForWinner(cells, lastMoveIndex) {
    const vertical = checkVertical(cells, lastMoveIndex);
    const horizontal = checkHorizontal(cells, lastMoveIndex);
    const diagonal = checkDiagonal(cells, lastMoveIndex);
    if (vertical) {
        return vertical;
    } else if (horizontal) {
        return horizontal;
    } else if (diagonal) {
        return diagonal;
    }
    return null;
}

function checkVertical(cells, lastMoveIndex) {
    for (let i = 0; i < 3; i++) {
        let index = lastMoveIndex + BOARD_LENGTH * (i + 1);
        if (index > NUM_CELLS || cells[index] !== cells[lastMoveIndex]) {
            return null;
        }
    }
    const winningCells = [lastMoveIndex, lastMoveIndex + BOARD_LENGTH, lastMoveIndex + BOARD_LENGTH * 2, lastMoveIndex + BOARD_LENGTH * 3]
    return winningCells;
}

function checkDiagonal(cells, lastMoveIndex) {
    const diagonals = [
        [14, 22, 30, 38],
        [7, 15, 23, 31],
        [15, 23, 31, 37],
        [0, 8, 16, 24],
        [8, 16, 24, 32],
        [16, 24, 32, 40],
        [1, 9, 17, 25],
        [9, 17, 25, 33],
        [17, 25, 33, 41],
        [2, 10, 18, 26],
        [10, 18, 26, 34],
        [3, 11, 19, 27],
        [3, 9, 15, 21],
        [4, 10, 16, 22],
        [10, 16, 22, 28],
        [5, 11, 17, 23],
        [11, 17, 23, 29],
        [17, 23, 29, 35],
        [6, 12, 18, 24],
        [12, 18, 24, 30],
        [18, 24, 30, 36],
        [13, 19, 25, 31],
        [19, 25, 31, 37],
        [20, 26, 32, 38]
    ];
    for (let i = 0; i < diagonals.length; i++) {
        if (diagonals[i].includes(lastMoveIndex)) {
            const [a, b, c, d] = diagonals[i];
            if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c] && cells[a] === cells[d]) {
                return diagonals[i];
            }
        }
    }
    return null;
}

function checkHorizontal(cells, lastMoveIndex) {
    const rowIndex = Math.floor(lastMoveIndex / BOARD_LENGTH);
    const rowStart = rowIndex * BOARD_LENGTH;
    const rowEnd = rowStart + 6;
    let rowOfCells = new Map();
    for (let i = 3; i > 0; i--) {
        if (lastMoveIndex - i >= rowStart) {
            rowOfCells.set(lastMoveIndex - i, cells[lastMoveIndex - i])
        }
    }
    rowOfCells.set(lastMoveIndex, cells[lastMoveIndex]);
    for (let i = 1; i < 4; i++) {
        if (lastMoveIndex + i <= rowEnd) {
            rowOfCells.set(lastMoveIndex + i, cells[lastMoveIndex + i]);
        }
    }
    let count = 0;
    let i = 0;
    for (let [key, value] of rowOfCells) {
        if (value === cells[lastMoveIndex]) {
            count++;
            if (count === 4) {
                const temp = Array.from(rowOfCells.keys()).slice(i - 3, i + 1);
                return temp;
            }
        } else {
            count = 0;
        }
        i++;
    }
    return null;
}
