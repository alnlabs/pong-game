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
  BALL_INITIAL_SPEED: 1, // Very slow start speed to prevent immediate scoring
  BALL_SPEED_INCREMENT: 0.08, // Very small speed increase per interval
  BALL_MAX_SPEED: 15,
  BALL_TIME_SPEED_INCREMENT: 0.03, // Very gradual time-based speed increase
  BALL_TIME_INTERVAL: 15000, // Increase speed every 15 seconds (much slower)
  
  // Game settings
  WIN_SCORE: 5,
  SPEED_INCREASE_INTERVAL: 20, // Increase speed every 20 hits (less frequent)
  
  // Obstacle settings
  OBSTACLES_ENABLED: true,
  HOLE_RADIUS: 30,
  POLE_WIDTH: 10,
  POLE_HEIGHT: 60,
  RANDOM_OBSTACLES: true, // Random obstacle placement each game
  MIN_HOLES: 1,
  MAX_HOLES: 3,
  MIN_POLES: 2,
  MAX_POLES: 5,
  // Dynamic obstacle system
  DYNAMIC_OBSTACLES: true, // Obstacles appear/disappear during gameplay
  PERMANENT_OBSTACLES: 2, // Number of permanent obstacles (always visible)
  TEMPORARY_OBSTACLES: true, // Enable temporary obstacles
  OBSTACLE_SPAWN_INTERVAL: 8000, // Spawn new temporary obstacle every 8 seconds
  OBSTACLE_DESPAWN_INTERVAL: 12000, // Temporary obstacle disappears after 12 seconds
  MAX_TEMPORARY_OBSTACLES: 3, // Maximum temporary obstacles on screen at once
  INITIAL_DELAY: 5000, // Wait 5 seconds before first temporary obstacle appears
  OBSTACLE_SPAWN_ON_SCORE: true, // Spawn obstacle when score changes (50% chance)
  
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

