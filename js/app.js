// General info for entity use
var entityInfo = {
    enemyCount: 5,
    enemyImgURL: 'images/enemy-bug.png',
    enemySpeedMin: 5,
    enemySpeedMax: 10,

    playerInitX: 200,
    playerInitY: 405,
    playerImgURL: 'images/char-boy.png',

    colWidth: 101,
    rowHeight: 83,

    colNum: 5,
    rowNum: 6,

    canvasWidth: 505,
    canvasHeight: 606,

    collisionThreshold: 50
}
var log = console.log.bind(console);

// Enemy class
class Enemy {
    constructor(initX, initY, speed) {
        this.sprite = entityInfo.enemyImgURL;
        this.initX = initX;
        this.x = initX;
        this.y = initY;
        this.speed = speed;
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

    reset() {
        this.x = this.initX;
        this.speed = getRndInteger(entityInfo.enemySpeedMin, entityInfo.enemySpeedMax);
    }

    checkCollision() {
        var collided = false,
            distance = getDistance(this.x, this.y, player.x, player.y);

        if (distance < entityInfo.collisionThreshold) {
            collided = true;
        }
        
        return collided;
    }
}

// Player class
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
            this.reset();
        }
        this.collided = false;
    }

    render() {
        ctx.drawImage(Resources.get(this.character), this.x, this.y);
    }

    reset() {
        this.x = entityInfo.playerInitX;
        this.y = entityInfo.playerInitY;
        this.gridX = Math.floor(entityInfo.colNum / 2);
        this.gridY = entityInfo.rowNum - 1;
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

// initialize player and enemies
var player = initPlayer(),
allEnemies = initEnemies(entityInfo.enemyCount);

function initPlayer () {
    var x = entityInfo.playerInitX,
        y = entityInfo.playerInitY,
        player = new Player(x, y);
    return player;
};

function initEnemies (enemyCount) {
    var count,
        enemies = [],
        colW = entityInfo.colWidth,
        rowH = entityInfo.rowHeight,
        enemyImg = Resources[entityInfo.enemyImgURL],
        // colOffset = -enemyImg.width,
        // rowOffset = rowH / 2.0 - enemyImg.height / 2.0;
        colOffset = -101,
        rowOffset = -25;

    for (count = 0; count < enemyCount; count++) {
        var col = 0,
            row = count % 3 + 1,
            speed = getRndInteger(entityInfo.enemySpeedMin, entityInfo.enemySpeedMax),
            enemy = new Enemy(colW * col + colOffset, rowH * row + rowOffset, speed);
        enemies.push(enemy);
    };

    return enemies;
};

// Key presses listener
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
};

function getDistance(x1, x2, y1, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}