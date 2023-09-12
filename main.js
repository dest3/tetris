document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let squares = Array.from(grid.querySelectorAll('div')); // Seleccionar todos los div dentro de .grid

    const ScoreDisplay = document.querySelector('#score');
    const StartBtn = document.querySelector('#start-button');

    const width = 10;  // Número de columnas en la cuadrícula

    //The Tetrominoes
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ]

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ]

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]

    const theTerominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    let currentPosition = 4;
    let currentRotation = 0;

    //selecciona un tetromino aleatoreamente
    let random = Math.floor(Math.random() * theTerominoes.length);
    let current = theTerominoes[random][currentRotation];

    //dibuja los tetrominos
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');

        });
    }


    //borra los tetrominos
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
        })
    }

    //velocidad con la que se mueven los tetrominos
    let speed = 1000
    timerId = setInterval(moveDown, speed);

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

document.addEventListener('keyup', control);


    //mover hacia abajo
    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    //detiene  los tetrominos al llegar al fondo 
    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            //dibujamos el siguiente tetromino
            random = Math.floor(Math.random() * theTerominoes.length)
            current = theTerominoes[random][currentRotation]
            currentPosition = 4
            draw()

        }
    }


    //muve el tetromino a la izquierda a menos que este en el borde de la pantalla
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if (!isAtLeftEdge) currentPosition -= 1
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1;

        }
        draw()
    }


    //muve el tetromino a la derecha a menos que este en el borde de la pantalla
    function moveRight() {
        undraw()
        const isARighyEdge = current.some(index => (currentPosition + index) % width === width -1)

        if (!isARighyEdge) currentPosition += 1
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;

        }
        draw()
    }

//rota el tetromino

function rotate(){
    undraw();
    currentRotation ++
    if(currentRotation === current.length){//si la rotacion alcanzo el maximo vuelve a 1
        currentRotation=0;
    }
    current= theTerominoes[random] [currentRotation]
    draw()
}








});


