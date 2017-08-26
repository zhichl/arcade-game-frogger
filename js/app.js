var entityInfo = {
    enemyCount: 3,
    enemyImgURL: 'images/enemy-bug.png',

    playerInitX: 200,
    playerInitY: 400,
    playerImgURL: 'images/char-boy.png',

    colWidth: 101,
    rowHeight: 83

}

// This class has an update(), render()
class Enemy {
    constructor(initX, initY, speed) {
        this.sprite = entityInfo.enemyImgURL;
        this.x = initX;
        this.y = initY;
        this.speed = speed;
    }
    update(dt) {}
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}


class Player {
    constructor(initX, initY) {
        this.character = entityInfo.playerImgURL;
        this.x = initX;
        this.y = initY;
    }
    update(dt) {}
    render() {
        ctx.drawImage(Resources.get(this.character), this.x, this.y);
    }
    handleInput(direction) {}
}



// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var initPlayer = function () {
    var x = entityInfo.playerInitX,
        y = entityInfo.playerInitY,
        player = new Player(x, y);
    return player;
};

var initEnemies = function (enemyCount) {
    var count,
        enemies = [],
        colW = entityInfo.colWidth,
        rowH = entityInfo.rowHeight,
        enemyImg = Resources[entityInfo.enemyImgURL],
        // colOffset = -enemyImg.width,
        // rowOffset = rowH / 2.0 - enemyImg.height / 2.0;
        colOffset = -0,
        rowOffset = -25;

    for (count = 0; count < enemyCount; count++) {
        var col = 0,
            row = count % 3 + 1,
            speed = getRndInteger(5, 15),
            enemy = new Enemy(colW * col + colOffset, rowH * row + rowOffset, speed);
        enemies.push(enemy);
    };

    // var enemy = new Enemy(0, 0, 0);
    // enemies.push(enemy);
    return enemies;
};

var player = initPlayer(),
    allEnemies = initEnemies(entityInfo.enemyCount);



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});


// Helper functions
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};