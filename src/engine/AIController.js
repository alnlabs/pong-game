// AI Controller - Handles AI paddle movement
import { GAME_CONFIG } from '../config/gameConfig';

export class AIController {
  constructor(difficulty = 'medium') {
    this.difficulty = difficulty;
    this.reactionDelay = this.getReactionDelay();
    this.predictionAccuracy = this.getPredictionAccuracy();
    this.lastUpdateTime = 0;
  }

  getReactionDelay() {
    // Reaction delay in milliseconds based on difficulty
    switch (this.difficulty) {
      case 'easy':
        return 150; // Slower reaction
      case 'medium':
        return 80; // Medium reaction
      case 'hard':
        return 30; // Fast reaction
      default:
        return 80;
    }
  }

  getPredictionAccuracy() {
    // Prediction accuracy (0-1) based on difficulty
    switch (this.difficulty) {
      case 'easy':
        return 0.6; // 60% accurate
      case 'medium':
        return 0.8; // 80% accurate
      case 'hard':
        return 0.95; // 95% accurate
      default:
        return 0.8;
    }
  }

  // Predict where the ball will be when it reaches the paddle's Y position
  predictBallPosition(ball, paddleY, canvasWidth) {
    if (!ball || ball.vy === 0) {
      return canvasWidth / 2; // Default to center if ball is not moving
    }

    // Calculate time until ball reaches paddle Y position
    const distanceToPaddle = Math.abs(ball.y - paddleY);
    const timeToReach = distanceToPaddle / Math.abs(ball.vy);

    // Predict X position
    let predictedX = ball.x + (ball.vx * timeToReach);

    // Account for wall bounces
    while (predictedX < 0 || predictedX > canvasWidth) {
      if (predictedX < 0) {
        predictedX = -predictedX;
      } else if (predictedX > canvasWidth) {
        predictedX = 2 * canvasWidth - predictedX;
      }
    }

    // Add some inaccuracy based on difficulty
    const inaccuracy = (1 - this.predictionAccuracy) * 50;
    const randomOffset = (Math.random() - 0.5) * inaccuracy;
    predictedX += randomOffset;

    return Math.max(0, Math.min(canvasWidth, predictedX));
  }

  // Get AI paddle movement direction
  getMovement(ball, paddle, canvasWidth, canvasHeight, isTopPaddle) {
    if (!ball || ball.vy === 0) {
      return 0; // No movement if ball is not moving
    }

    // Only move if ball is coming towards the AI's paddle
    const ballComingTowardsAI = isTopPaddle 
      ? ball.vy < 0  // Top paddle: ball moving up
      : ball.vy > 0; // Bottom paddle: ball moving down

    if (!ballComingTowardsAI) {
      // Move towards center when ball is going away
      const centerX = canvasWidth / 2;
      const paddleCenter = paddle.x + paddle.width / 2;
      if (Math.abs(paddleCenter - centerX) < 5) {
        return 0;
      }
      return paddleCenter < centerX ? 1 : -1;
    }

    // Predict where ball will be
    const targetX = this.predictBallPosition(ball, paddle.y, canvasWidth);
    const paddleCenter = paddle.x + paddle.width / 2;
    const distance = targetX - paddleCenter;

    // Add reaction delay simulation
    const currentTime = Date.now();
    if (currentTime - this.lastUpdateTime < this.reactionDelay) {
      return 0; // Wait before reacting
    }
    this.lastUpdateTime = currentTime;

    // Move towards predicted position
    if (Math.abs(distance) < 5) {
      return 0; // Close enough, don't move
    }

    return distance > 0 ? 1 : -1;
  }

  setDifficulty(difficulty) {
    this.difficulty = difficulty;
    this.reactionDelay = this.getReactionDelay();
    this.predictionAccuracy = this.getPredictionAccuracy();
  }
}

