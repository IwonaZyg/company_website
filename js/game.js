const board = ['pink', 'blue', 'green', 'red', 'purple', 'orange'];
const myBoard = [];
const tempBoard = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 4, 4, 4, 2, 2, 2, 2, 2, 1,
    1, 1, 1, 1, 2, 2, 2, 2, 2, 1,
    1, 2, 1, 1, 1, 1, 1, 1, 2, 1,
    1, 2, 3, 2, 2, 2, 2, 2, 2, 1,
    1, 2, 1, 1, 1, 1, 1, 1, 2, 1,
    1, 2, 2, 2, 2, 1, 2, 2, 2, 1,
    1, 2, 1, 1, 1, 1, 1, 1, 2, 1,
    1, 2, 2, 2, 2, 2, 2, 2, 2, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
];
const keyz = {
  ArrowRight: false,
  ArrowLeft: false,
  ArrowUp: false,
  ArrowDown: false
};
const ghosts = [];
const gameContent = {
  x: '',
  y: '',
  h: 50,
  size: 20,
  ghosts: 6,
  inplay: false,
  startGhost: 11
}
const player = {
  pos: 32,
  speed: 6,
  cool: 0,
  pause: false,
  score: 0,
  lives: 1,
  gameover: true,
  gamewin: false,
  powerup: false,
  powerCount: 0
}
const startGame = document.querySelector('button');

document.addEventListener('DOMContentLoaded', () => {
  gameContent.grid = document.querySelector('.grid'); 
  gameContent.pacman = document.querySelector('.pacman'); 
  gameContent.eye = document.querySelector('.eye');
  gameContent.mouth = document.querySelector('.mouth');
  gameContent.ghost = document.querySelector('.ghost');
  gameContent.score = document.querySelector('.score');
  gameContent.lives = document.querySelector('.lives');
  gameContent.pacman.style.display = 'none';
  gameContent.ghost.style.display = 'none';
  gameContent.grid.style.display = 'none';
  boardBuilder();
  
})
document.addEventListener('keydown', (e) => {
  
  if (e.code in keyz) {
    keyz[e.code] = true;
  }
  if (!gameContent.inplay && !player.pause) {
    player.play = requestAnimationFrame(move);
    gameContent.inplay = true;
  }
})
document.addEventListener('keyup', (e) => {
    if (e.code in keyz) {
      keyz[e.code] = false;
    }
  })
 
startGame.addEventListener('click', boardBuilder);

function boardBuilder() {
  console.log(tempBoard);
  tempBoard.length = 0;
  let boxSize = (document.documentElement.clientHeight < document.documentElement.clientWidth) ? document.documentElement.clientHeight : document.documentElement.clientWidth;
  console.log(boxSize);
  gameContent.h = (boxSize / gameContent.size) - (boxSize / (gameContent.size * 5));
  console.log(gameContent.h);
  let tog = false;
  for (let x = 0; x < gameContent.size; x++) {
    let wallz = 0;
    for (let y = 0; y < gameContent.size; y++) {
      let val = 2;
      wallz--;
      if (wallz > 0 && (x - 1) % 2) {
        val = 1;
      }
      else {
        wallz = Math.floor(Math.random() * (gameContent.size / 2));
      }
      if (x == 1 || x == (gameContent.size - 3) || y == 1 || y == (gameContent.size - 2)) {
        val = 2; 
      }
      if (x == (gameContent.size - 2)) {
        if (!tog) {
            gameContent.startGhost = tempBoard.length;
          tog = true;
        }
        val = 4;
      }
      if ((y == 3) || (y == (gameContent.size - 4))) {
        if (x == 1 || x == (gameContent.size - 3)) {
          val = 3;
        }
      }
      if (x == 0 || x == (gameContent.size - 1) || y == 0 || y == (gameContent.size - 1)) {
        val = 1;
      }
      tempBoard.push(val);
    }
  }
  starterGame();
}

function move() {
  if (gameContent.inplay) {
    player.cool--; 
    if (player.cool < 0) {
     
      let tempPower = 0;
      if (player.powerup) {
        player.powerCount--;
        gameContent.pacman.style.backgroundColor = 'red';
        if (player.powerCount < 20) {
            gameContent.pacman.style.backgroundColor = 'orange';
          if (player.powerCount % 2) {
            gameContent.pacman.style.backgroundColor = 'white';
          }
        }
        if (player.powerCount <= 0) {
          player.powerup = false;
          gameContent.pacman.style.backgroundColor = 'yellow';
          console.log('Power Down');
          tempPower = 1;
        }
      }
      ghosts.forEach((ghost) => {
          if (tempPower == 1) {
            ghost.style.backgroundColor = ghost.defaultColor;
          }
          else if (player.powerCount > 0) {
            if (player.powerCount % 2) {
              ghost.style.backgroundColor = 'white';
            }
            else {
              ghost.style.backgroundColor = 'blue';
            }
          }
          myBoard[ghost.pos].append(ghost);
          ghost.counter--;

          let oldPOS = ghost.pos; 
          
          let collide = player.pos == ghost.pos;

          if (ghost.counter <= 0) {
            changeDir(ghost);
          }
          else {
            if (ghost.dx == 0) {
              ghost.pos -= gameContent.size;
            }
            else if (ghost.dx == 1) {
              ghost.pos += gameContent.size;
            }
            else if (ghost.dx == 2) {
              ghost.pos += 1;
            }
            else if (ghost.dx == 3) {
              ghost.pos -= 1;
            }
          }
          
          collide = collide || player.pos == ghost.pos;
          if (collide) {
           
            if (player.powerCount > 0) {
             
              player.score += 100;
              let randomRegenerateSpot = Math.floor(Math.random() * 40);
              
              ghost.stopped = 100;
              ghost.pos = gameContent.startGhost;
            }
            else {
              player.lives--;
              gameReset();
            }
            updateScore();
          }

          let valGhost = myBoard[ghost.pos]; 
          if (valGhost.t == 1) {
            ghost.pos = oldPOS;
            changeDir(ghost);
          }
          if(ghost.stopped>0){
            ghost.stopped--;
            ghost.pos = startPosPlayer(gameContent.startGhost);
          }
          myBoard[ghost.pos].append(ghost);
        })
        
      let tempPos = player.pos; 
      if (keyz.ArrowRight) {
        player.pos += 1;
        gameContent.eye.style.left = '20%';
        gameContent.mouth.style.left = '60%';
      }
      else if (keyz.ArrowLeft) {
        player.pos -= 1;
        gameContent.eye.style.left = '60%';
        gameContent.mouth.style.left = '0%';
      }
      else if (keyz.ArrowUp) {
        player.pos -= gameContent.size;
      }
      else if (keyz.ArrowDown) {
        player.pos += gameContent.size;
      }
      let newPlace = myBoard[player.pos]; 
      if (newPlace.t == 1 || newPlace.t == 4) {
      
        player.pos = tempPos;
      }
    
      if (newPlace.t == 3) {
        player.powerCount = 30;
        player.powerup = true;
        console.log('powerup');
        myBoard[player.pos].innerHTML = '';
        player.score += 10;
        updateScore();
        newPlace.t = 0;
      }
      if (newPlace.t == 2) {
        
       
        myBoard[player.pos].innerHTML = '';
        let tempDots = document.querySelectorAll('.dot');
        if (tempDots.length == 0) {
          playerWins();
        };
        player.score++;
        updateScore();
        newPlace.t = 0;
      }
      if (player.pos != tempPos) { 
      
        if (player.tog) {
            gameContent.mouth.style.height = '30%';
          player.tog = false;
        }
        else {
            gameContent.mouth.style.height = '10%';
          player.tog = true;
        }
      }
      player.cool = player.speed; 
     
    }
    if (!player.pause) {
      myBoard[player.pos].append(gameContent.pacman);
      player.play = requestAnimationFrame(move);
    }
  }
}

function starterGame() {
  myBoard.length = 0;
  ghosts.length = 0;
 
  gameContent.grid.innerHTML = '';
  gameContent.x = '';
  if (!player.gamewin) {
    player.score = 0;
    player.lives = 1;
  }
  else {
    player.gamewin = false;
  }
  player.gameover = false;
  createGame(); 
  updateScore();
  gameContent.grid.focus();
  gameContent.grid.style.display = 'grid';
 
  gameContent.pacman.style.display = 'block';
}

function playerWins() {
  player.gamewin = true;
  gameContent.inplay = false;
  player.pause = true;
  startGame.style.display = 'block';
  startGame.style.margin = '10px auto';
}

function endGame() {
  player.gamewin = false;
  startGame.style.display = 'block';
  startGame.style.margin = '10px auto';
}

function gameReset() {
  
  window.cancelAnimationFrame(player.play);
  gameContent.inplay = false;
  player.pause = true;
  if (player.lives <= 0) {
    player.gameover = true;
    endGame();
  }
  if (!player.gameover) {
    setTimeout(startPos, 3000);
  }
}

function startPos() {
  
  player.pause = false;
  let firstStartPos = 20;
  player.pos = startPosPlayer(firstStartPos);
  myBoard[player.pos].append(gameContent.pacman);
  ghosts.forEach((ghost, ind) => {
    let temp = gameContent.startGhost;
    console.log(temp);
    console.log(gameContent.startGhost);
    ghost.pos = startPosPlayer(temp);
    myBoard[ghost.pos].append(ghost);
  })
}

function startPosPlayer(val) {
  if (myBoard[val].t != 1) {
    return val;
  }
  return startPosPlayer(val + 1);
}

function updateScore() {
  if (player.lives <= 0) {
    player.gameover = true;
    gameContent.lives.innerHTML = 'GAME OVER';
  }
  else {
    gameContent.score.innerHTML = `Score : ${player.score}`;
    gameContent.lives.innerHTML = `Lives : ${player.lives}`;
  }
}

function createGhost() {
  let newGhost = gameContent.ghost.cloneNode(true);
  newGhost.pos = gameContent.startGhost;
  newGhost.style.display = 'block';
  newGhost.counter = 0;
  newGhost.defaultColor = board[ghosts.length];
  newGhost.dx = Math.floor(Math.random() * 4);
  newGhost.style.backgroundColor = board[ghosts.length];
  newGhost.style.opacity = '0.8';
  newGhost.namer = board[ghosts.length] + 'y';
  ghosts.push(newGhost);
 
}

function createGame() {
  for (let i = 0; i < gameContent.ghosts; i++) {
    createGhost();
  }
  tempBoard.forEach((cell) => {
   
    createSquare(cell);
  })
  for (let i = 0; i < gameContent.size; i++) {
    gameContent.x += ` ${gameContent.h}px `; 
  }
  gameContent.grid.style.gridTemplateColumns = gameContent.x;
  gameContent.grid.style.gridTemplateRows = gameContent.x;
  startPos();
}

function createSquare(val) {
  const div = document.createElement('div');
  div.classList.add('box');
  if (val == 1) {
    div.classList.add('wall');
  } 
  if (val == 2) {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    div.append(dot);
  } 
  if (val === 4) {
    div.classList.add('hideout');
    if (gameContent.startGhost == 11) {
        gameContent.startGhost = myBoard.length;
    }
  }
  if (val == 3) {
    const dot = document.createElement('div');
    const bitcoinList = ["fa-brands", "fa-bitcoin","bitcoin"]
        dot.classList.add(...bitcoinList);
    
    div.append(dot);
  } 
  gameContent.grid.append(div);
  myBoard.push(div);
  div.t = val; 
  div.idVal = myBoard.length;
  div.addEventListener('click', (e) => {
    console.dir(div);
  })
}

function findDir(a) {
  let val = [a.pos % gameContent.size, Math.ceil(a.pos / gameContent.size)]; //col,row
  return val;
}

function changeDir(ene) {
  let gg = findDir(ene);
  let pp = findDir(player);
  

  let ran = Math.floor(Math.random() * 3);
  console.log(ran);
  if (ran < 2) {
    ene.dx = (gg[0] < pp[0]) ? 2 : 3;
  } 
  else {
    ene.dx = (gg[1] < pp[1]) ? 1 : 0;
  } 
  ene.counter = (Math.random() * 8) + 1;
}

startGame.addEventListener('click', starterGame)