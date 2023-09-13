document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const startBtn = document.querySelector("#start_button");
  const scoreDisplay = document.querySelector("#score");
  const width = 10; // Número de columnas en la cuadrícula
  let timerId = null;
  let squares = Array.from(grid.querySelectorAll("div")); // Seleccionar todos los div dentro de .grid
  let nextRandom = 0;
  let score = 0;
  let lvl=0;
  let liines=0;

  const color = [
    //colores de los tetrominos en orden
    "orange",
    "red",
    "purple",
    "green",
    "blue",
  ];

  //The Tetrominoes
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const theTerominoes = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];

  let currentPosition = 4;
  let currentRotation = 0;

  //selecciona un tetromino aleatoreamente
  let random = Math.floor(Math.random() * theTerominoes.length);
  let current = theTerominoes[random][currentRotation];

  //dibuja los tetrominos
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("tetromino");
      squares[currentPosition + index].style.backgroundColor = color[random]; //asigna un color
    });
  }

  //borra los tetrominos
  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("tetromino");
      squares[currentPosition + index].style.backgroundColor = "";
    });
  }

  //velocidad con la que se mueven los tetrominos
  let speed = 1000;
  //   timerId = setInterval(moveDown, speed); inicia el juego cuando se carga la pantalla

  // Captura las teclas presionadas
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }

  document.addEventListener("keyup", control);

  //mover hacia abajo
  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }

  //detiene  los tetrominos al llegar al fondo
  function freeze() {
    if (
      current.some((index) =>
        squares[currentPosition + index + width].classList.contains("taken")
      )
    ) {
      current.forEach((index) =>
        squares[currentPosition + index].classList.add("taken")
      );
      random = nextRandom; //asignamos el siguiente tetromino a la mini grid
      nextRandom = Math.floor(Math.random() * theTerominoes.length); //dibujamos el siguiente tetromino en el tablero
      current = theTerominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
      addLevel();
    }
  }

  //muve el tetromino a la izquierda a menos que este en el borde de la pantalla
  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );

    if (!isAtLeftEdge) currentPosition -= 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition += 1;
    }
    draw();
  }

  //muve el tetromino a la derecha a menos que este en el borde de la pantalla
  function moveRight() {
    undraw();
    const isARighyEdge = current.some(
      (index) => (currentPosition + index) % width === width - 1
    );

    if (!isARighyEdge) currentPosition += 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition -= 1;
    }
    draw();
  }

  //rota el tetromino

  function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) {
      //si la rotacion alcanzo el maximo vuelve a 1
      currentRotation = 0;
    }
    current = theTerominoes[random][currentRotation];
    draw();
  }

  //muestra el proximo tetromino en la "mini-grid"

  const displaySquares = document.querySelectorAll(".mini-grid div");
  const displayWidth = 4;
  const displayIndex = 0;

  //dibujamos la primera rotacion del tetromino siguiente:

  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2],
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
    [1, displayWidth, displayWidth + 1, displayWidth + 2],
    [0, 1, displayWidth, displayWidth + 1],
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],
  ];

  //muestra los tetrominos en el mini grid

  function displayShape() {
    displaySquares.forEach((squares) => {
      squares.classList.remove("tetromino");
      squares.style.backgroundColor = "";
    });
    upNextTetrominoes[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add("tetromino");
      displaySquares[displayIndex + index].style.backgroundColor =
        color[nextRandom];
    });
  }

  //start/pause button
  startBtn.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, speed);
      nextRandom = Math.floor(Math.random() * theTerominoes.length);
      displayShape();
    }
  });

  // Función para gestionar el puntaje y la eliminación de filas completas
function addScore() {
    for (let i = 0; i < 199; i += width) {//recorre todos las casillas del tablero (divs)
      // Crear un array 'row' que representa una fila completa
      const row = [i, i + 1, i + 2, i + 3, i + 4, i + 6, i + 7, i + 8, i + 9];
  
      // Verificar si todas las celdas en 'row' están marcadas como 'taken'
      if (row.every((index) => squares[index].classList.contains("taken"))) {
        // Incrementar el puntaje en 10 puntos
        score += 10;
        // Actualizar la pantalla de puntaje
        scoreDisplay.innerHTML = score;
  
        // Remover las clases y el color de fondo de las celdas en 'row'
        row.forEach((index) => {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("tetromino");
          squares[index].style.backgroundColor = "";
        });
  
        // Eliminar la fila completa del tablero
        const squareRemoved = squares.splice(i, width);
        squares = squareRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  }
  
  //game over

  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      scoreDisplay.innerHTML = "game over";
      clearInterval(timerId);
    }
  }
});
