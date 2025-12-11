// Game Engine - Handles all game physics and logic
import { GAME_CONFIG } from '../config/gameConfig';

export class GameEngine {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.reset();
  }

  reset() {
    // Ball state - ensure ball always has velocity
    const randomVx = Math.random() > 0.5 ? 1 : -1;
    const randomVy = Math.random() > 0.5 ? 1 : -1;
    this.ball = {
      x: this.canvasWidth / 2,
      y: this.canvasHeight / 2,
      vx: GAME_CONFIG.BALL_INITIAL_SPEED * randomVx,
      vy: GAME_CONFIG.BALL_INITIAL_SPEED * randomVy,
      speed: GAME_CONFIG.BALL_INITIAL_SPEED,
      size: GAME_CONFIG.BALL_SIZE
    };
    
    // Ensure ball has non-zero velocity
    if (this.ball.vx === 0) {
      this.ball.vx = GAME_CONFIG.BALL_INITIAL_SPEED;
    }
    if (this.ball.vy === 0) {
      this.ball.vy = GAME_CONFIG.BALL_INITIAL_SPEED;
    }

    // Paddle states
    this.paddle1 = {
      x: this.canvasWidth / 2 - GAME_CONFIG.PADDLE_WIDTH / 2,
      y: GAME_CONFIG.PADDLE_MARGIN,
      width: GAME_CONFIG.PADDLE_WIDTH,
      height: GAME_CONFIG.PADDLE_HEIGHT,
      lastX: this.canvasWidth / 2 - GAME_CONFIG.PADDLE_WIDTH / 2,
      velocity: 0 // Track paddle movement
    };

    this.paddle2 = {
      x: this.canvasWidth / 2 - GAME_CONFIG.PADDLE_WIDTH / 2,
      y: this.canvasHeight - GAME_CONFIG.PADDLE_MARGIN - GAME_CONFIG.PADDLE_HEIGHT,
      width: GAME_CONFIG.PADDLE_WIDTH,
      height: GAME_CONFIG.PADDLE_HEIGHT,
      lastX: this.canvasWidth / 2 - GAME_CONFIG.PADDLE_WIDTH / 2,
      velocity: 0 // Track paddle movement
    };

    // Game state
    this.score1 = 0;
    this.score2 = 0;
    this.hitCount = 0;
    this.gameState = 'ready'; // 'ready', 'playing', 'paused', 'gameOver'
    this.winner = null;
  }
  
  start() {
    if (this.gameState === 'ready') {
      this.gameState = 'playing';
    }
  }

  updatePaddle(paddleNum, direction) {
    const paddle = paddleNum === 1 ? this.paddle1 : this.paddle2;
    const oldX = paddle.x;
    const newX = paddle.x + (direction * GAME_CONFIG.PADDLE_SPEED);
    
    // Keep paddle within bounds
    paddle.x = Math.max(0, Math.min(
      this.canvasWidth - paddle.width,
      newX
    ));
    
    // Calculate paddle velocity (movement direction and speed)
    paddle.velocity = (paddle.x - oldX) / GAME_CONFIG.PADDLE_SPEED; // -1, 0, or 1
    paddle.lastX = oldX;
  }

  updateBall(obstacles = []) {
    if (this.gameState !== 'playing') return;

    // Ensure ball has valid velocity (check for NaN or 0)
    if (isNaN(this.ball.vx) || isNaN(this.ball.vy) || (this.ball.vx === 0 && this.ball.vy === 0)) {
      this.resetBall();
    }

    // Update ball position
    this.ball.x += this.ball.vx;
    this.ball.y += this.ball.vy;

    // Ball collision with walls
    if (this.ball.x <= this.ball.size || this.ball.x >= this.canvasWidth - this.ball.size) {
      this.ball.vx = -this.ball.vx;
      this.ball.x = Math.max(this.ball.size, Math.min(
        this.canvasWidth - this.ball.size,
        this.ball.x
      ));
    }

    // Check collision with obstacles
    if (GAME_CONFIG.OBSTACLES_ENABLED) {
      obstacles.forEach(obstacle => {
        this.handleObstacleCollision(obstacle);
      });
    }

    // Update paddle velocities before collision check (for spin calculation)
    // Calculate velocity based on position change
    const paddle1Vel = (this.paddle1.x - (this.paddle1.lastX || this.paddle1.x)) / GAME_CONFIG.PADDLE_SPEED;
    const paddle2Vel = (this.paddle2.x - (this.paddle2.lastX || this.paddle2.x)) / GAME_CONFIG.PADDLE_SPEED;
    this.paddle1.velocity = paddle1Vel;
    this.paddle2.velocity = paddle2Vel;
    
    // Check collision with paddles
    this.handlePaddleCollision(this.paddle1, 1);
    this.handlePaddleCollision(this.paddle2, -1);
    
    // Update last positions after collision check
    this.paddle1.lastX = this.paddle1.x;
    this.paddle2.lastX = this.paddle2.x;

    // Check for goals
    if (this.ball.y < 0) {
      this.score2++;
      this.resetBall();
      this.checkGameOver();
      // Return to ready state after goal (player must start again)
      if (this.gameState !== 'gameOver') {
        this.gameState = 'ready';
      }
    } else if (this.ball.y > this.canvasHeight) {
      this.score1++;
      this.resetBall();
      this.checkGameOver();
      // Return to ready state after goal (player must start again)
      if (this.gameState !== 'gameOver') {
        this.gameState = 'ready';
      }
    }
  }

  handlePaddleCollision(paddle, direction) {
    const ballCenterX = this.ball.x;
    const ballCenterY = this.ball.y;
    const ballRadius = this.ball.size / 2;

    // Check if ball is in paddle's Y range
    const paddleTop = paddle.y;
    const paddleBottom = paddle.y + paddle.height;
    const paddleLeft = paddle.x;
    const paddleRight = paddle.x + paddle.width;

    // Check collision based on direction
    if (direction === 1) {
      // Top paddle - ball moving up
      if (this.ball.vy < 0 && 
          ballCenterY - ballRadius <= paddleBottom &&
          ballCenterY - ballRadius >= paddleTop &&
          ballCenterX + ballRadius >= paddleLeft &&
          ballCenterX - ballRadius <= paddleRight) {
        this.hitPaddle(paddle);
      }
    } else {
      // Bottom paddle - ball moving down
      if (this.ball.vy > 0 &&
          ballCenterY + ballRadius >= paddleTop &&
          ballCenterY + ballRadius <= paddleBottom &&
          ballCenterX + ballRadius >= paddleLeft &&
          ballCenterX - ballRadius <= paddleRight) {
        this.hitPaddle(paddle);
      }
    }
  }

  hitPaddle(paddle) {
    // Calculate hit position on paddle (0 = left edge, 1 = right edge)
    const hitPos = (this.ball.x - paddle.x) / paddle.width;
    
    // Base angle from hit position (max 60 degrees)
    let angle = (hitPos - 0.5) * Math.PI / 3;
    
    // Add spin/angle based on paddle movement (up to 30 degrees additional)
    // If paddle moving left while hitting, add left spin
    // If paddle moving right while hitting, add right spin
    const paddleSpin = paddle.velocity * (Math.PI / 6); // Max 30 degrees spin
    angle += paddleSpin;
    
    // Clamp angle to prevent too extreme angles (max 75 degrees total)
    const maxAngle = Math.PI / 2.4; // ~75 degrees
    angle = Math.max(-maxAngle, Math.min(maxAngle, angle));
    
    // Update velocity with new angle
    const speed = Math.sqrt(this.ball.vx ** 2 + this.ball.vy ** 2);
    const direction = this.ball.vy > 0 ? -1 : 1; // Determine direction (up or down)
    this.ball.vx = Math.sin(angle) * speed;
    this.ball.vy = direction * Math.cos(angle) * speed;
    
    // Add speed boost if paddle was moving (adds excitement!)
    if (Math.abs(paddle.velocity) > 0.5) {
      this.ball.vx += paddle.velocity * 0.5; // Small speed boost
    }
    
    // Increase speed gradually
    this.hitCount++;
    if (this.hitCount % GAME_CONFIG.SPEED_INCREASE_INTERVAL === 0) {
      this.increaseBallSpeed();
    }
  }

  increaseBallSpeed() {
    if (this.ball.speed < GAME_CONFIG.BALL_MAX_SPEED) {
      this.ball.speed = Math.min(
        this.ball.speed + GAME_CONFIG.BALL_SPEED_INCREMENT,
        GAME_CONFIG.BALL_MAX_SPEED
      );
      
      // Normalize and scale velocity
      const currentSpeed = Math.sqrt(this.ball.vx ** 2 + this.ball.vy ** 2);
      if (currentSpeed > 0) {
        const ratio = this.ball.speed / currentSpeed;
        this.ball.vx *= ratio;
        this.ball.vy *= ratio;
      }
    }
  }

  handleObstacleCollision(obstacle) {
    if (obstacle.type === 'hole') {
      this.handleHoleCollision(obstacle);
    } else if (obstacle.type === 'pole') {
      this.handlePoleCollision(obstacle);
    }
  }

  handleHoleCollision(hole) {
    const dx = this.ball.x - hole.x;
    const dy = this.ball.y - hole.y;
    const distance = Math.sqrt(dx ** 2 + dy ** 2);
    const radius = hole.radius || GAME_CONFIG.HOLE_RADIUS;

    // If ball falls into hole, reset ball
    if (distance < radius - this.ball.size / 2) {
      this.resetBall();
      // Return to ready state after hole (player must start again)
      if (this.gameState !== 'gameOver') {
        this.gameState = 'ready';
      }
    }
  }

  handlePoleCollision(pole) {
    const ballCenterX = this.ball.x;
    const ballCenterY = this.ball.y;
    const ballRadius = this.ball.size / 2;
    const poleWidth = pole.width || GAME_CONFIG.POLE_WIDTH;
    const poleHeight = pole.height || GAME_CONFIG.POLE_HEIGHT;

    const poleLeft = pole.x - poleWidth / 2;
    const poleRight = pole.x + poleWidth / 2;
    const poleTop = pole.y - poleHeight / 2;
    const poleBottom = pole.y + poleHeight / 2;

    // Check collision
    if (ballCenterX + ballRadius >= poleLeft &&
        ballCenterX - ballRadius <= poleRight &&
        ballCenterY + ballRadius >= poleTop &&
        ballCenterY - ballRadius <= poleBottom) {
      
      // Determine which side was hit
      const overlapLeft = (ballCenterX + ballRadius) - poleLeft;
      const overlapRight = poleRight - (ballCenterX - ballRadius);
      const overlapTop = (ballCenterY + ballRadius) - poleTop;
      const overlapBottom = poleBottom - (ballCenterY - ballRadius);

      const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

      if (minOverlap === overlapLeft || minOverlap === overlapRight) {
        this.ball.vx = -this.ball.vx;
      } else {
        this.ball.vy = -this.ball.vy;
      }

      // Move ball out of collision
      if (minOverlap === overlapLeft) {
        this.ball.x = poleLeft - ballRadius;
      } else if (minOverlap === overlapRight) {
        this.ball.x = poleRight + ballRadius;
      } else if (minOverlap === overlapTop) {
        this.ball.y = poleTop - ballRadius;
      } else {
        this.ball.y = poleBottom + ballRadius;
      }
    }
  }

  resetBall() {
    this.ball.x = this.canvasWidth / 2;
    this.ball.y = this.canvasHeight / 2;
    const randomVx = Math.random() > 0.5 ? 1 : -1;
    const randomVy = Math.random() > 0.5 ? 1 : -1;
    this.ball.vx = GAME_CONFIG.BALL_INITIAL_SPEED * randomVx;
    this.ball.vy = GAME_CONFIG.BALL_INITIAL_SPEED * randomVy;
    this.ball.speed = GAME_CONFIG.BALL_INITIAL_SPEED;
    
    // Ensure ball has non-zero velocity
    if (this.ball.vx === 0) {
      this.ball.vx = GAME_CONFIG.BALL_INITIAL_SPEED;
    }
    if (this.ball.vy === 0) {
      this.ball.vy = GAME_CONFIG.BALL_INITIAL_SPEED;
    }
  }

  checkGameOver() {
    if (this.score1 >= GAME_CONFIG.WIN_SCORE) {
      this.gameState = 'gameOver';
      this.winner = 1;
    } else if (this.score2 >= GAME_CONFIG.WIN_SCORE) {
      this.gameState = 'gameOver';
      this.winner = 2;
    }
  }

  pause() {
    if (this.gameState === 'playing') {
      this.gameState = 'paused';
    } else if (this.gameState === 'paused') {
      this.gameState = 'playing';
    }
    // Don't allow pausing when in 'ready' state
  }
  
  start() {
    if (this.gameState === 'ready') {
      this.gameState = 'playing';
    }
  }

  restart() {
    this.reset();
  }

  getState() {
    return {
      ball: { ...this.ball },
      paddle1: { ...this.paddle1 },
      paddle2: { ...this.paddle2 },
      score1: this.score1,
      score2: this.score2,
      gameState: this.gameState,
      winner: this.winner,
      hitCount: this.hitCount
    };
  }
}

