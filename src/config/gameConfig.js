// Game configuration for easy customization and platform deployment
export const GAME_CONFIG = {
  // Canvas dimensions
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  
  // Paddle settings
  PADDLE_WIDTH: 100,
  PADDLE_HEIGHT: 15,
  PADDLE_SPEED: 8,
  PADDLE_MARGIN: 20, // Distance from edge
  
  // Ball settings
  BALL_SIZE: 12,
  BALL_INITIAL_SPEED: 5,
  BALL_SPEED_INCREMENT: 0.2, // Speed increase per hit
  BALL_MAX_SPEED: 15,
  
  // Game settings
  WIN_SCORE: 5,
  SPEED_INCREASE_INTERVAL: 10, // Increase speed every 10 hits
  
  // Obstacle settings
  OBSTACLES_ENABLED: true,
  HOLE_RADIUS: 30,
  POLE_WIDTH: 10,
  POLE_HEIGHT: 60,
  
  // Colors
  COLORS: {
    BACKGROUND: '#1a1a2e',
    PADDLE: '#0f3460',
    BALL: '#e94560',
    TEXT: '#ffffff',
    OBSTACLE: '#16213e',
    GOAL_LINE: '#533483'
  },
  
  // Platform-specific settings (can be overridden)
  PLATFORMS: {
    default: {
      // Default settings
    },
    itch: {
      // Itch.io specific settings
    },
    newgrounds: {
      // Newgrounds specific settings
    },
    gamejolt: {
      // GameJolt specific settings
    }
  }
};

