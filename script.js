const gameBoard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];
  const setTile = (index, sign) => {
    board[index] = sign;
  };
  const getTile = (index) => {
    return board[index];
  };
  const resetTiles = () => {
    for (let index = 0; index < board.length; index++) {
      board[index] = "";
    }
  };
  return { setTile, getTile, resetTiles, board };
})();

const displayController = (() => {
  const tiles = document.querySelectorAll(".tile");
  const restartButton = document.querySelector(".restart-button");
  let playerXScore = 0;
  let playerOScore = 0;
  let ties = 0;
  tiles.forEach((tile) =>
    tile.addEventListener("click", (event) => {
      const tile = event.target;
      const tileIndex = Array.from(tiles).indexOf(tile);

      let fieldSign = event.target.dataset.fieldSign;
      if (gameController.getIsOver() || fieldSign == "X" || fieldSign == "O")
        return;

      gameController.makeMove(tileIndex);
      updateGameboard();
    })
  );

  const updateGameboard = () => {
    for (let i = 0; i < tiles.length; i++) {
      tiles[i].dataset.fieldSign = gameBoard.getTile(i);
    }
    document
      .querySelectorAll("[data-field-turn]")
      .forEach((el) => (el.dataset.fieldTurn = gameController.getCurrPlayer()));
  };

  const restartGame = () => {
    gameController.resetGame();
    updateGameboard();
  };

  restartButton.addEventListener("click", restartGame);

  return { updateGameboard };
})();

const gameController = (() => {
  let isOver = false;
  let currPlayer = "";
  let soundActive = true;
  const muteButton = document.querySelector(".mute-button");

  muteButton.addEventListener("click", (e) => {
    soundActive = soundActive === true ? false : true;
    muteButton.dataset.fieldMute = !soundActive;
  });

  const resetGame = () => {
    gameBoard.resetTiles();
    isOver = false;
    currPlayer = "X";
    document.querySelector(
      ".turn-indicator"
    ).innerHTML = `${currPlayer}'S Turn`;
  };

  const initializeGame = () => {
    resetGame();
    displayController.updateGameboard();
  };

  const changePlayer = () => {
    currPlayer = currPlayer === "X" ? "O" : "X";
  };

  const makeMove = (tileIndex) => {
    gameBoard.setTile(tileIndex, currPlayer);
    if (soundActive) {
      const tapAudio = new Audio("/aud/tap.wav");
      tapAudio.play();
    }
    if (checkWinner(tileIndex)) {
      currPlayer = "";
      if (soundActive) {
        const gameOverAudio = new Audio("/aud/game-over.wav");
        gameOverAudio.play();
      }
      return;
    }
    changePlayer();
    document.querySelector(
      ".turn-indicator"
    ).innerHTML = `${currPlayer}'S Turn`;
  };

  const checkWinner = (tileIndex) => {
    const winningConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
      const winCondition = winningConditions[i];
      const a = gameBoard.getTile(winCondition[0]);
      const b = gameBoard.getTile(winCondition[1]);
      const c = gameBoard.getTile(winCondition[2]);

      if (a === "" || b === "" || c === "") {
        continue;
      }

      if (a === b && b === c) {
        roundWon = true;
        break;
      }
    }

    if (roundWon) {
      document.querySelector(
        ".turn-indicator"
      ).innerHTML = `${currPlayer} has won!`;
      isOver = true;
      return true;
    }

    if (!gameBoard.board.includes("")) {
      document.querySelector(".turn-indicator").innerHTML = "Game is a draw!";
      isOver = true;
      return true;
    }
  };

  const getIsOver = () => {
    return isOver;
  };

  const getCurrPlayer = () => {
    return currPlayer;
  };

  return {
    getIsOver,
    resetGame,
    makeMove,
    getCurrPlayer,
    initializeGame,
  };
})();
document.addEventListener("DOMContentLoaded", gameController.initializeGame);
