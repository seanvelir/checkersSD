window.onload = function(ev) {
  // This is the checker the user is holder, or else null.
  // The user can only hold one checker at a time.
  var checkerInHand = null;

  function highlightChecker(checker, highlight) {
    if (highlight) {
      checker.className += " highlight";
    } else {
      var className = checker.className;
      checker.className = className.replace(/(?:\s|^)highlight(?:\s|$)/, "");
    }
  }

  function handleCheckerClicked(ev) {
    if (checkerInHand) {
      highlightChecker(checkerInHand, false);
      if (checkerInHand == this) {
        checkerInHand = null;
        return;
      }
      checkerInHand = null;
    }
    highlightChecker(this, true);
    checkerInHand = this;
  }

  function makeChecker(color) {
    var checker = document.createElement('div');
    checker.className = color + "-checker";

    checker.color = color;
    checker.king = false;

    checker.onclick = handleCheckerClicked;
    return checker;
  }

  function kingMe(checker) {
    checker.className += " kinged";
    checker.king = true;
  }

  function maybeKingMe(checker, square) {
    var KING_ROW_BLACK = 7;
    var KING_ROW_RED   = 0;
    
    if (checker.color === "black" &&
        square.boardPosition.y === KING_ROW_BLACK) {
      kingMe(checker);
    }
    if (checker.color === "red" &&
        square.boardPosition.y === KING_ROW_RED) {
      kingMe(checker);
    }
  }

  function handleSquareClicked(ev) {
    if (!checkerInHand) {
      return;
    }

    checkerInHand.style.left = this.offsetLeft + 6 + "px";
    checkerInHand.style.top = this.offsetTop + 6 + "px";
    highlightChecker(checkerInHand, false);

    maybeKingMe(checkerInHand, this);

    if (checkerInHand.spare) {
      addReplacementSpare(checkerInHand);
    }
    
    checkerInHand = null;
  }

  function makeSquare(color) {
    var div = document.createElement('div');
    div.className = color + "-square";
    div.onclick = handleSquareClicked;
    return div;
  }

  function makeBoard() {
    var board = document.createElement('div');
    board.className = "board";
    for (var i = 0; i < 8; ++i) {
      var row = document.createElement('div');
      row.className = "row";
      for (var j = 0; j < 8; ++j) {
        var square = makeSquare(j % 2 == i % 2 ? "black" : "red");
        square.boardPosition = {x: j, y: i};
        row.appendChild(square);
      }
      board.appendChild(row);
    }

    return board;
  }
  
  function setupRow(left, top, color) {
    var LEFT_DELTA = 168;

    for (var i = 0; i < 4; ++i, left += LEFT_DELTA) {
      var checker = makeChecker(color);
      checker.style.left = left + "px";
      checker.style.top = top + "px";
      document.body.appendChild(checker);
    }
  }

  function setupBoard() {
    // TODO: Refactor so checkers are placed based on the target square,
    // as in handleSquareClicked, instead of mere visually alignment.

    setupRow(16,  16,  "black");
    setupRow(100, 100, "black");
    setupRow(16,  184, "black");
    setupRow(100, 436, "red");
    setupRow(16,  520, "red");
    setupRow(100, 604, "red");
  }

  function deathByBlackHole(checker) {
    var checkerRect = checker.getBoundingClientRect();
    if (checkerRect.width < 10) {
      document.body.removeChild(checker);
      return;
    }

    checker.style.height = checkerRect.height - 3 + "px";
    checker.style.width = checkerRect.width - 3 + "px";

    console.log(checkerRect.height);
    console.log(checkerRect.width);

    setTimeout(function() {
      deathByBlackHole(checker);
    }, 10);
  }

  function handleClickOnBlackHole() {
    if (!checkerInHand) {
      return;
    }
    checkerInHand.style.left = this.offsetLeft + 90 + "px";
    checkerInHand.style.top = this.offsetTop + 90 + "px";

    deathByBlackHole(checkerInHand);
    checkerInHand = null;
  }

  function addBlackHole() {
    var blackhole = document.createElement('div');
    blackhole.className = "blackhole";
    blackhole.onclick = handleClickOnBlackHole;
    document.body.appendChild(blackhole);
  }
  
  function makeSpare(color) {
    var spare = makeChecker(color);
    spare.spare = true;
    spare.className += " spare-" + color;
    return spare;
  }

  function addSpareCheckers() {
    document.body.appendChild(makeSpare("black"));
    document.body.appendChild(makeSpare("red"));
  }

  function addReplacementSpare(checker) {
    document.body.appendChild(makeSpare(checker.color));
  }

  // Initialize the game board.
  document.body.appendChild(makeBoard());
  addBlackHole();
  addSpareCheckers();
  setupBoard();
}