// setup canvas

const counter = document.querySelector('p');

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

class Shape {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update = function () {
    if ((this.x + this.size) >= width) {
      this.velX = -(this.velX);
    }

    if ((this.x - this.size) <= 0) {
      this.velX = -(this.velX);
    }

    if ((this.y + this.size) >= height) {
      this.velY = -(this.velY);
    }

    if ((this.y - this.size) <= 0) {
      this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
  }
}

class Ball extends Shape{
  constructor(x, y, velX, velY, exists, color, size) {
  super(x, y, velX, velY)
  this.color = color;
  this.size = size;
  this.exists = exists;
  }
}

class EvilCircle extends Shape {
  constructor(x, y) {
    super(x, y, 20, 20);

    this.color = "white";
    this.size = 10;

  }

  draw() {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  checkBounds = function () {
    if ((this.x + this.size) >= width) {
      this.x = -(this.size);
    }

    if ((this.x - this.size) <= 0) {
      this.x = -(this.size);
    }

    if ((this.y + this.size) >= height) {
      this.y = -(this.size);
    }

    if ((this.y - this.size) <= 0) {
      this.y = -(this.size);
    }

  }

  SetControls() {
    var _this = this;
    window.onkeydown = function(e) {
      if (e.keyCode === 65) {
        _this.x -= _this.velX;
      } else if (e.keyCode === 68) {
        _this.x += _this.velX;
      } else if (e.keyCode === 87) {
        _this.y -= _this.velY;
      } else if (e.keyCode === 83) {
        _this.y += _this.velY;
      }
    }
  }
}

class Game {
  constructor(nbrBalles = 50, couleurBalles = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')', grandeurBalles = (random(10, 20))){
    this.balls = [];
    this.count = 0;
    this.nbrBalles = nbrBalles;
    this.couleurBalles = couleurBalles;
    this.grandeurBalles = grandeurBalles;
  }

  init(){

    while (this.balls.length < this.nbrBalles) {
      let size = this.grandeurBalles;
      let ball = new Ball(
        // ball position always drawn at least one ball width
        // away from the edge of the canvas, to avoid drawing errors
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-7, 7),
        random(-7, 7),
        true,
        this.couleurBalles,
        size
      );
    
      this.balls.push(ball);
      this.count++;
      counter.textContent = 'Ball count: ' + this.count;

    }
  }
  
  start() {

    this.init();

    var count = this.count;
    var balls = this.balls;

    const evilBall = new EvilCircle(width/2, height/2);
    evilBall.SetControls();

    function collisionDetectBall(ball) {
      for (let j = 0; j < balls.length; j++) {
        if (!(ball === balls[j])) {
          const dx = ball.x - balls[j].x;
          const dy = ball.y - balls[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
  
          if (distance < ball.size + balls[j].size) {
            balls[j].color = ball.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
          }
        }
      }
    }
  
    function collisionDetectEvil(evilCircle) {
      for (let j = 0; j < balls.length; j++) {
        if (balls[j].exists) {
          const dx = evilCircle.x - balls[j].x;
          const dy = evilCircle.y - balls[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
  
          if (distance < evilCircle.size + balls[j].size) {
            balls[j].exists = false;
            count--;
            counter.textContent = 'Ball count: ' + count;
          }
        }
      }
    }
    
    var loop = function() {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);
    
      for (let i = 0; i < balls.length; i++) {
        if (balls[i].exists){
          balls[i].draw();
          balls[i].update();
          collisionDetectBall(balls[i]);
        }
      }
    
      evilBall.draw();
      evilBall.checkBounds();
      collisionDetectEvil(evilBall);
    
      requestAnimationFrame(loop);
    }
    
    loop();
  }
}

new Game().start();


