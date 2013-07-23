function MovingObject(xPos, yPos, radius) {
  this.xPos = xPos;
  this.yPos = yPos;
  this.radius = radius;
};

function Surrogate() {};
Surrogate.prototype = MovingObject.prototype;

MovingObject.prototype.update = function (velocity) {
  this.xPos += velocity["x"];
  this.yPos += velocity["y"];
  if (this.xPos > 500) { this.xPos = this.xPos % 500; };
  if (this.yPos > 500) { this.yPos = this.yPos % 500; };
  if (this.xPos < 0) { this.xPos = this.xPos + 500; };
  if (this.yPos < 0) { this.yPos = this.yPos + 500; };
};

MovingObject.prototype.offScreen = function (xDim, yDim) {
  var xOff = (this.xPos > xDim || this.xPos < 0);
  var yOff = (this.yPos > yDim || this.yPos < 0);

  console.log(xOff);
  if (xOff || yOff) {
    return true;
  };

  return false;
};

function Asteroid(xPos, yPos, radius) {
  MovingObject.call(this, xPos, yPos, radius);

  var xDir = Math.random() > .5 ? -1 : 1;
  var yDir = Math.random() > .5 ? -1 : 1;
  var maxR = 20;

  this.velocity = {x: xDir * Math.random(), y: yDir * Math.random()};

  this.randomAsteroid = function (maxX, maxY) {
    var side = Math.floor(Math.random() * 4);
    var x = 0;
    var y = 0;
    switch (side)
    {
    case 0: //top
      x = maxX * Math.random();
      break;
    case 1: //bot
      x = maxX * Math.random();
      y = 500;
      break;
    case 2: //left
      y = maxY * Math.random();
      break;
    case 3: //right
      x = 500;
      y = maxY * Math.random();
      break;
    default:
      console.log("here, im depressed...")
    };
    return new Asteroid(x, y, maxR * (0.5 + Math.random()));
  };
};

Asteroid.prototype = new Surrogate();

Asteroid.prototype.draw = function (ctx) {
  var grad = ctx.createLinearGradient(0,0,500,500);
  grad.addColorStop(0, "black");
  grad.addColorStop(0.15, "red");
  grad.addColorStop(0.2, "yellow");
  grad.addColorStop(0.4, "red");
  grad.addColorStop(0.5, "gray");
  grad.addColorStop(0.6, "yellow");
  grad.addColorStop(0.8, "red");
  grad.addColorStop(1, "black");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(this.xPos, this.yPos, this.radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  ctx.stroke();
};

function Game(xDim, yDim, numOfAsteroids) {
  this.xDim = xDim;
  this.yDim = yDim;
  this.ship = new Ship(xDim/2, yDim/2, 5, this);

  this.asteroids = [];
  for (var i = 0; i < numOfAsteroids; i++) {
    var a = new Asteroid();
    this.asteroids.push(a.randomAsteroid(xDim, yDim));
  };

  this.bullets = [];
};

Game.prototype.draw = function (ctx) {
  ctx.clearRect(0, 0, this.xDim, this.yDim);
  this.ship.draw(ctx);
  this.asteroids.forEach(function (asteroid) {
    asteroid.draw(ctx);
  });
  this.bullets.forEach(function (bullet) {
    bullet.draw(ctx);
  });
};

Game.prototype.update = function (win) {
  var that = this;

  this.ship.update(this.ship.velocity);
  this.asteroids.forEach(function (asteroid) {
    if (asteroid.offScreen(that.xDim, that.yDim) === true){
      var index = that.asteroids.indexOf(asteroid);
      that.asteroids.splice(index, 1);

      var a = new Asteroid();
      this.asteroids.push(a.randomAsteroid(that.xDim, that.yDim));
    };
    asteroid.update(asteroid.velocity);
  });
  this.bullets.forEach(function (bullet) {
    bullet.update(bullet.velocity);
  });

  if (this.ship.isHit(this.asteroids) === true) {
    alert("You've been hit!");
    clearInterval(win);
  };

};

Game.prototype.start = function(canvasEl) {
  var that = this;
  var ctx = canvasEl.getContext("2d");

  var img = new Image();
  img.onload = function () {
    ctx.drawImage(img, xOffset, yOffset);
  };
  img.src = 'myImage.png';


  var win = window.setInterval(function () {
    that.update(win);
    that.draw(ctx);
  }, 30);
}

function Ship(xPos, yPos, radius, game) {
  var that = this;
  MovingObject.call(this, xPos, yPos, radius);
  this.angle = 0;
  this.game = game;
  this.velocity = {x: 0, y: 0};
  this.bullets = [];

  key('up', function(){ that.power(-0.5) });
  key('down', function(){ that.power(0.5) });
  key('left', function(){ that.angle -= (Math.PI/18) });
  key('right', function(){ that.angle += (Math.PI/18) });
  key('space', function(){ that.fireBullet() });
}

Ship.prototype = new Surrogate();

Ship.prototype.draw = function (ctx) {
  // ctx.fillStyle = "cyan";
 //  ctx.beginPath();
 //  ctx.arc(this.xPos, this.yPos, this.radius, 0, 2 * Math.PI);
 //  ctx.fill();
 //  ctx.lineWidth = 2.5;
 //  ctx.strokeStyle = "teal";
 //  ctx.stroke();

  ctx.save();
  ctx.clearRect(0, 0, this.game.xDim, this.game.yDim);
  ctx.fillStyle = "cyan";
  ctx.translate(this.xPos, this.yPos);
  ctx.rotate(this.angle);
  ctx.translate(-this.xPos, -this.yPos);
  ctx.beginPath();
  ctx.moveTo(this.xPos,this.yPos-12);
  ctx.lineTo(this.xPos-5,this.yPos+3);
  ctx.lineTo(this.xPos+5,this.yPos+3);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "teal";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
};

Ship.prototype.isHit = function (asteroids) {
  var that = this;
  var hit = false;
  asteroids.forEach(function(asteroid){
    var xDist = Math.pow((asteroid.xPos - that.xPos),2);
    var yDist = Math.pow((asteroid.yPos - that.yPos),2);
    if (Math.sqrt(xDist + yDist) < (asteroid.radius + that.radius)){
      hit = true;
    }
  });
  return hit;
};

Ship.prototype.power = function (delta) {
  this.velocity["x"] += delta * -Math.sin(this.angle);
  this.velocity["y"] += delta * Math.cos(this.angle);
};

Ship.prototype.fireBullet = function () {
  var bullet = new Bullet(this.xPos, this.yPos, this.velocity, this.game, this.angle);
  this.game.bullets.push(bullet);
};


function Bullet(xPos, yPos, velocity, game, angle) {
  MovingObject.call(this, xPos, yPos);

  this.velocity = { x: 10 * Math.sin(angle), y: 10 * -Math.cos(angle) };
  this.game = game;

}

Bullet.prototype = new Surrogate();

Bullet.prototype.draw = function (ctx) {
  ctx.fillStyle = "violet";
  ctx.beginPath();
  ctx.arc(this.xPos, this.yPos, 2.5, 0, 2 * Math.PI);
  ctx.fill();
}

Bullet.prototype.update = function (velocity) {
  var that = this;
  this.xPos += velocity["x"];
  this.yPos += velocity["y"];

  if (this.offScreen(this.game.xDim, this.game.yDim) === true){
    console.log(this.game.bullets)
    var index = this.game.bullets.indexOf(this);
    this.game.bullets.splice(index, 1);
    console.log(this.game.bullets)
  };

  this.game.asteroids.forEach(function(asteroid){
    var xDist = Math.pow((asteroid.xPos - that.xPos),2);
    var yDist = Math.pow((asteroid.yPos - that.yPos),2);
    if (Math.sqrt(xDist + yDist) < (asteroid.radius + 2.5)){
      console.log("hit");
      var index = that.game.bullets.indexOf(that);
      that.game.bullets.splice(index, 1);
      var index2 = that.game.asteroids.indexOf(asteroid);
      that.game.asteroids.splice(index2, 1);

      var a = new Asteroid();
      that.game.asteroids.push(a.randomAsteroid(that.game.xDim, that.game.yDim));
    };
  });


};

