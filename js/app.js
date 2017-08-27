// General info for entity use
var entityInfo = {
    canvasWidth: 505,
    canvasHeight: 606,
    colNum: 5,
    rowNum: 6,
    colWidth: 101,
    rowHeight: 83,

    enemyNum: 3,
    enemyImgURL: 'images/enemy-bug.png',
    enemyWidth: 98,
    enemyHeight: 67,
    enemySpeedMin: 3,
    enemySpeedMax: 9,

    enemyInitX: function() {
        return -(this.enemyWidth);
    },

    playerImgURL: 'images/char-boy.png',
    playerWidth: 68,
    playerHeight: 77,

    playerInitX: function() {
        return this.canvasWidth / 2.0 - this.playerWidth / 2.0;
    },

    playerInitY: function() {
        return this.rowNum * this.rowHeight - this.playerHeight / 2.5;
    }
};
var log = console.log.bind(console);

// Enemy class
// methods: update(int), render(), move(), reset(), checkCollision()
class Enemy {
    constructor(row) {
        this.sprite = entityInfo.enemyImgURL;

        // select a row (y-coordinate in grid) randomly in range [1, 4)
        this.gridY = getRndInteger(1, 4);
        
        this.x = entityInfo.enemyInitX();
        this.y = entityInfo.rowHeight * this.gridY + (entityInfo.rowHeight - entityInfo.enemyHeight / 2);

        // decide a random speed in range [enemySpeedMin, enemySpeedMax)
        this.speed = getRndInteger(entityInfo.enemySpeedMin, entityInfo.enemySpeedMax);
    }
    update(dt) {
        var collided = this.checkCollision();
        if (collided) {
            player.collided = true;
        }
        this.move();
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    move() {
        if (this.x < entityInfo.canvasWidth) {
            this.x += this.speed;
        } else {
            this.reset();
        }
    }

    // reset entity properties
    reset() {
        this.gridY = getRndInteger(1, 4);
        this.x = entityInfo.enemyInitX();
        this.y = entityInfo.rowHeight * this.gridY + (entityInfo.rowHeight - entityInfo.enemyHeight / 2);
        this.speed = getRndInteger(entityInfo.enemySpeedMin, entityInfo.enemySpeedMax);
    }

    checkCollision() {
        var ex = this.x, eW = entityInfo.enemyWidth, 
            px = player.x, pW = entityInfo.playerWidth,
            sameRow = this.gridY === player.gridY;

        return sameRow && px - eW <= ex && ex <= px + pW;
    }
}

// Player class
// methods: update(int), render(), reset(), checkWin(), handleInput(String), moveLeft / Right / Up / Down ()
class Player {
    constructor(initX, initY) {
        this.character = entityInfo.playerImgURL;
        this.x = initX;
        this.y = initY;

        // position by grid (5*6 grid)
        this.gridX = Math.floor(entityInfo.colNum / 2);
        this.gridY = entityInfo.rowNum - 1;

        this.speedX = entityInfo.colWidth;
        this.speedY = entityInfo.rowHeight;

        this.collided = false;
    }

    update(dt) {
        if (this.collided) {
            // trigger resetGame after 100ms the collision happened to make an enemy-player "touch" effect
            setTimeout(function() {
                resetGame(); 
            }, 100);
        } else {
            // if wins, hold winning state for 1s
            var win = this.checkWin();
            if (win) {
                this.win = true;
                setTimeout(function() {
                    resetGame(); 
                }, 1000);
            }
        }
    }

    render() {
        // render player character
        ctx.drawImage(Resources.get(this.character), this.x, this.y);

        // render winning message
        if (this.win === true) {
            ctx.font = '35px sans-serif';
            // ctx.fillStyle = "rgb(40, 104, 236)";
            ctx.fillStyle = "white";
            ctx.fillText("You Win!", 185, 575);
        }
    }

    // reset entity properties
    reset() {
        this.x = entityInfo.playerInitX();
        this.y = entityInfo.playerInitY();
        this.gridX = Math.floor(entityInfo.colNum / 2);
        this.gridY = entityInfo.rowNum - 1;
        this.collided = false;
        this.win = false;
    }

    checkWin() {
        return this.gridY === 0;
    }

    handleInput(direction) {
        // check direction is not undefined
        if (direction) {

            // horizontal direction
            if (direction === "left" || direction === "right") {
                if (direction === "left") {
                    this.moveLeft();
                } else {
                    this.moveRight();
                }

                // vertical direction
            } else {
                if (direction === "up") {
                    this.moveUp();
                } else {
                    this.moveDown();
                }
            }
        }
    }

    moveLeft() {
        if (this.gridX !== 0) {
            this.x -= this.speedX;
            this.gridX -= 1;
        }
    }

    moveRight() {
        if (this.gridX !== entityInfo.colNum - 1) {
            this.x += this.speedX;
            this.gridX += 1;
        }
    }

    moveUp() {
        if (this.gridY !== 0) {
            this.y -= this.speedY;
            this.gridY -= 1;
        }
    }

    moveDown() {
        if (this.gridY !== entityInfo.rowNum - 1) {
            this.y += this.speedY;
            this.gridY += 1;
        }
    }
}

// Initialize player and enemies
var player = initPlayer(),
    allEnemies = initEnemies(entityInfo.enemyNum);

function initPlayer() {
    var x = entityInfo.playerInitX(),
        y = entityInfo.playerInitY(),
        player = new Player(x, y);
    return player;
}

function initEnemies(enemyNum) {
    var count,
        enemies = [];
        // colW = entityInfo.colWidth,
        // rowH = entityInfo.rowHeight,
        // xOffset = -entityInfo.enemyWidth,
        // yOffset = rowH - entityInfo.enemyHeight / 2;
    
    for (count = 0; count < enemyNum; count++) {
        enemies.push(new Enemy());
    }
    return enemies;
}

// Reset game
function resetGame() {
    // TODO: more advanced functions and resets.
    player.reset();
}

// Key presses listener
// two ways: arrow keys and A/W/D/S binding
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        // arrow keys
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',

        // A / W / D / S
        65: 'left',
        87: 'up',
        68: 'right',
        83: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});


// Helper functions
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getDistance(x1, x2, y1, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}