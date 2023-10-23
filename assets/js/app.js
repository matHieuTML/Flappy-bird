"use strict";

let board = document.getElementById("board"), boardWidth = 360, boardHeight = 640, context = null;

//bird
let birdWidth = 34, birdHeight = 24, birdX = boardWidth/8, birdY = boardHeight/2, birdImage = null;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

//pipe
let pipeArray = [], pipeWidth = 56, pipeHeight = 512, pipeX = boardWidth, pipeY = 0, topPipeImage = null, bottomPipeImage = null;

//physics
let velodityX = -2;
let velocityY = 0; // bird jumpin speed
let gravity = 0.4; // bird falling speed
let gameOver = false;
let score = 0;

window.onload = function() {
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    //draw bird
    //context.fillStyle = "red";
    //context.fillRect(bird.x, bird.y, bird.width, bird.height);

    //load image
    birdImage = new Image();
    birdImage.src = "assets/img/flappybird.png"; 
    birdImage.onload = function() {
        context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
    }
    topPipeImage = new Image();
    topPipeImage.src = "assets/img/toppipe.png";

    bottomPipeImage = new Image();
    bottomPipeImage.src = "assets/img/bottompipe.png";


    requestAnimationFrame(update);
    setInterval(placePipes, 1500);// toutes les 1.5 secondes on place un pipe

    document.addEventListener("click", function() {
        velocityY = -6;


        if(gameOver) {
            gameOver = false;
            pipeArray = [];
            score = 0;
            velocityY = 0;
            bird.y = birdY;
        }
    });

};  

function update() {
    requestAnimationFrame(update);
    if(gameOver){
        return;
    } 

    context.clearRect(0, 0, boardWidth, boardHeight);

    //draw bird
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);

    //draw pipes
    for(let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velodityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if(!pipe.passed && pipe.x + pipe.width < bird.x) {
            pipe.passed = true;
            score += 0.5;
        }
    }

    //remove pipes
    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    //detect collision structure ternaire
    if(pipeArray.some(pipe => detectCollision(bird, pipe))) {
        gameOver = true;
    }

    
    if(bird.y > boardHeight) {
        gameOver = true;
    }

    //score
    context.fillStyle = "white";
    context.font = "45px Arial";
    context.fillText(score, 5, 50);

    if(gameOver) {
        context.fillStyle = "rgba(0, 0, 0, 0.5)";
        context.fillRect(0, 0, boardWidth, boardHeight);

        context.fillStyle = "white";
        context.font = "30px Arial";
        context.fillText("Game Over", 100, boardHeight/2);

        
    }
}

function placePipes() {
    if(gameOver){
        return;
    } 

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = 125 + Math.random()*20;

    let topPipe = {
        img : topPipeImage,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImage,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);
};


function detectCollision(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}