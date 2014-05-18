window.onload = function(ev) {
  var checkerInHand = null;

  function highlightChecker(checker, highlight) {
    if (highlight) {
      checker.className += " highlight";
    } else {
      var className = checker.className;
      checker.className = className.replace("highlight", "");
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
    var div = document.createElement('div');
    div.className = color + "-checker";
    div.onclick = handleCheckerClicked;
    return div;
  }

  function handleSquareClicked(ev) {
    if (!checkerInHand) {
      return;
    }

    checkerInHand.style.left = this.offsetLeft + 6 + "px";
    checkerInHand.style.top = this.offsetTop + 6 + "px";
    highlightChecker(checkerInHand, false);
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
        row.appendChild(square);
      }
      board.appendChild(row);
    }
    document.body.appendChild(board);
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
    setupRow(16, 16,   "black");
    setupRow(100, 100, "black");
    setupRow(16, 184,  "black");
    setupRow(100, 436,  "red");
    setupRow(16, 520, "red");
    setupRow(100, 604,  "red");
  }

  function destroyChecker(checker) {
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
      destroyChecker(checker);
    }, 10);
  }

  function handleClickOnBlackHole() {
    if (!checkerInHand) {
      return;
    }
    checkerInHand.style.left = this.offsetLeft + 90 + "px";
    checkerInHand.style.top = this.offsetTop + 90 + "px";

    destroyChecker(checkerInHand);
    checkerInHand = null;
  }

  function addBlackHole() {
    var blackhole = document.createElement('div');
    blackhole.className = "blackhole";
    blackhole.onclick = handleClickOnBlackHole;
    document.body.appendChild(blackhole);
  }

  makeBoard();
  addBlackHole();
  setupBoard();
}