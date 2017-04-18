
var canvas;
var canvasContext;
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;

var resetScore = 0;
var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 10;

var showingWinScreen = false;

var ballX = 50;
var ballSpeedX = 3.5;
var ballSpeedXPercent = ballSpeedX / 100;
var ballY = 50;
var ballSpeedY = 1;
var ballSize = 10;
var speedChange = 1.8;
var padMargin = 5;
var paddleBallBounce = 6;

var Zero = 0;

var paddle1Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 3;
var paddle2Y = 250;
var AI_Difficulty = 5; // 2=easy 3=medium 4=hard 5=veryhard 9=you lose
var AI_SmoothMove = 2; // this makes the AI not jagg when the ball is close to the center + needs to be a lower number to be smooth

function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x:mouseX,
    y:mouseY
  };
}

window.onload = function() {

  canvas = document.getElementById('gameCanvas').setAttribute('width', canvasWidth);
  canvas = document.getElementById('gameCanvas').setAttribute('height', canvasHeight);
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  console.log(ballSpeedX);


  document.getElementById("player2Score").src = "img/" + player2Score + ".jpg";
  document.getElementById("player1Score").src = "img/" + player1Score + ".jpg";

  var framesPerSecond = 120;
  setInterval(function() {
    moveEverything();
    drawEverything();
  }, 1000/framesPerSecond);

  canvas.addEventListener('mousedown',
    function click(evt) {
      moveEverything();
        showingWinScreen = false;
        document.getElementById("player1Score").src = "img/" + resetScore + ".jpg";
        document.getElementById("player2Score").src = "img/" + resetScore + ".jpg";
        document.getElementById("winOrLose").src = "img/" + inGame + ".jpg";
    }
);

  canvas.addEventListener('mousemove',
    function(evt) {
      var mousePos = calculateMousePos(evt);
      paddle1Y = mousePos.y - (PADDLE_HEIGHT / 2);
    });
}

function ballReset() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}

function ballSpeedReset() {
  if(player1Score > WINNING_SCORE - 1 ||
     player2Score > WINNING_SCORE - 1) {
       showingWinScreen = true;
       player1Score = WINNING_SCORE;
       player2Score = WINNING_SCORE;
     }
  else {
    player1Score = player1Score;
    player2Score = player2Score;
  }

  ballSpeedX = 8.5;
  ballSpeedY = 1;
}

function speedChangeReset() {
  speedChange = 1;
}

function moveEverything() {
  if(showingWinScreen) {
    return;
  }

  ballX = ballX + ballSpeedX;
  ballY = ballY + ballSpeedY;
  if(ballX > canvas.width - ballSize - PADDLE_WIDTH - padMargin) {
    if(ballY > paddle2Y &&
       ballY < paddle2Y + PADDLE_HEIGHT) {
         ballSpeedX = -ballSpeedX - speedChange;

         var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2);
         ballSpeedY = deltaY * (ballSpeedXPercent * paddleBallBounce);

         console.log(ballSpeedX);
       }

    else if(ballX > canvas.width) {
      player1Score++;
      ballReset();
      ballSpeedReset();
      document.getElementById("player1Score").src = "img/" + player1Score + ".jpg";
    }

  }
  if(ballX < PADDLE_WIDTH + padMargin + ballSize) {
    if(ballY > paddle1Y &&
       ballY < paddle1Y + PADDLE_HEIGHT) {
         ballSpeedX = - ballSpeedX + speedChange;

         var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
         ballSpeedY = deltaY * (ballSpeedXPercent * paddleBallBounce);

         console.log(ballSpeedX);
       }

    else if(ballX < canvas.width - canvas.width) {
      player2Score++;
      ballReset();
      ballSpeedReset();

      if(player2Score < 10) {
        document.getElementById("player2Score").src = "img/" + player2Score + ".jpg";
      }
      else if(player2Score >= 10) {
        document.getElementById("player2Score").src = "img/" + 9 + ".jpg"
      }
    }
  }
  // Self explanatory
  if(ballY > canvas.height - ballSize) {
    ballSpeedY = -ballSpeedY - speedChange;
  }
  if(ballY < ballSize) {
    ballSpeedY = -ballSpeedY + speedChange;
  }
  if(ballSpeedX < 4) {
    speedChange = 4.2;
  }
  if(ballSpeedX < 6) {
    speedChange = 0.1;
  }
  // The following "if" tags makes the AI center the ball on it's pad and depending on difficulty setting it will fail or succed with that
  if(showingWinScreen) {
    paddle1Y = paddle2Y
  }
  if(ballY < paddle2Y + PADDLE_HEIGHT / 10) {
    paddle2Y = paddle2Y - AI_Difficulty;
  }
  else if(ballY < paddle2Y + PADDLE_HEIGHT / 2) {
    paddle2Y = paddle2Y - AI_SmoothMove;
  }
  if(ballY > paddle2Y + PADDLE_HEIGHT / 1.2) {
    paddle2Y = paddle2Y + AI_Difficulty;
  }
  else if(ballY > paddle2Y + PADDLE_HEIGHT / 2) {
    paddle2Y = paddle2Y + AI_SmoothMove;
  }
}

// broken code

/* function winOrLoseCondition {
  if (showingWinScreen = true) {
    document.getElementById("winOrLose").src = "img/" + win + ".jpg";
  }
  else if (showingLoseScreen = true) {
    document.getElementById("winOrLose").src = "img/" + lose + ".jpg";
  }
  else {
    document.getElementById("winOrLose").src = "img/" + inGame + ".jpg";
  }
}; */

function drawEverything() {
  // next line blanks out the screen with black
  colorRect(Zero, Zero, canvas.width, canvas.height, 'black');

  // this is left player panel
  colorRect(padMargin, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');

  // the following line draws the ball
  colorCircle(ballX, ballY, ballSize, 'white');

  // This is the AI player 2 panel
  colorRect(canvas.width - PADDLE_WIDTH - padMargin, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');
}

// Makes the ball a ball
function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  /* The "Zero" says what angle the "arc" should start to be drawn and "Math.PI*2" says go a full lap around a cirkle and
  with just "PI" you just draw half a cirkle*/
  canvasContext.arc(centerX, centerY, radius, Zero, Math.PI*2, true);
  canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}
