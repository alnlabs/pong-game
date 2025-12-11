import React, { useEffect, useRef, useCallback, useState } from 'react';
import { GameEngine } from '../engine/GameEngine';
import { AIController } from '../engine/AIController';
import socketManager from '../utils/socketManager';
import firebaseMultiplayer from '../utils/firebaseMultiplayer';
import { GAME_CONFIG } from '../config/gameConfig';
import TouchControls from './TouchControls';

const GameBoard = ({ onScoreUpdate, onGameOver, gameMode = '2player', aiDifficulty = 'medium', onlineConfig = null }) => {
  const canvasRef = useRef(null);
  const gameEngineRef = useRef(null);
  const aiControllerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const keysRef = useRef({});
  const obstaclesRef = useRef([]);
  const opponentPaddleRef = useRef(null);
  const lastPaddleXRef = useRef(null);
  const syncIntervalRef = useRef(null);
  const isHostRef = useRef(false);
  const touchDirectionRef = useRef({ player1: 0, player2: 0 });
  const [canvasSize, setCanvasSize] = useState({ 
    width: GAME_CONFIG.CANVAS_WIDTH, 
    height: GAME_CONFIG.CANVAS_HEIGHT 
  });
  const [forceUpdate, setForceUpdate] = useState(0);
  const obstacleSpawnTimerRef = useRef(null);
  const obstacleDespawnTimersRef = useRef([]);
  const lastScoreRef = useRef({ score1: 0, score2: 0 });
  const startDynamicObstacleSystemRef = useRef(null);
  
  // Initialize game engine immediately with default size
  useEffect(() => {
    if (!gameEngineRef.current) {
      gameEngineRef.current = new GameEngine(
        GAME_CONFIG.CANVAS_WIDTH,
        GAME_CONFIG.CANVAS_HEIGHT
      );
    }
    
    // Initialize or update AI controller when mode or difficulty changes
    if (gameMode === 'ai') {
      if (!aiControllerRef.current || aiControllerRef.current.difficulty !== aiDifficulty) {
        aiControllerRef.current = new AIController(aiDifficulty);
      }
    } else {
      // Clear AI controller when not in AI mode
      aiControllerRef.current = null;
    }
  }, [gameMode, aiDifficulty]); // Re-run when mode or difficulty changes

  // Calculate responsive canvas size - mobile-first, scales proportionally
  useEffect(() => {
    const updateCanvasSize = () => {
      // Mobile-first: start with mobile sizing, scale up proportionally
      const padding = 24; // Account for padding and safe areas
      const maxWidth = window.innerWidth - padding;
      const aspectRatio = GAME_CONFIG.CANVAS_HEIGHT / GAME_CONFIG.CANVAS_WIDTH;
      // Use mobile-first approach: scale from mobile size up, but cap at original canvas size
      const baseMobileWidth = Math.min(350, maxWidth); // Base mobile width
      const width = Math.min(maxWidth, Math.max(baseMobileWidth, Math.min(GAME_CONFIG.CANVAS_WIDTH, maxWidth)));
      const height = width * aspectRatio;
      setCanvasSize({ width, height });
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    window.addEventListener('orientationchange', updateCanvasSize);
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('orientationchange', updateCanvasSize);
    };
  }, []);

  // Generate random obstacles (scaled for mobile)
  const generateRandomObstacles = useCallback((width, height, count = null, permanent = false) => {
    const scaleX = width / GAME_CONFIG.CANVAS_WIDTH;
    const scaleY = height / GAME_CONFIG.CANVAS_HEIGHT;
    const obstacles = [];
    
    // If count specified, use it; otherwise random
    let numHoles, numPoles;
    if (count) {
      // Mix of holes and poles for permanent obstacles
      numHoles = Math.floor(count / 2); // Half holes, half poles
      numPoles = count - numHoles;
    } else {
      numHoles = Math.floor(Math.random() * 3) + 1;
      numPoles = Math.floor(Math.random() * 4) + 2;
    }
    
    // Safe zones (avoid paddle areas and center)
    const safeZoneTop = 50 * scaleY;
    const safeZoneBottom = height - 50 * scaleY;
    const safeZoneLeft = 100 * scaleX;
    const safeZoneRight = width - 100 * scaleX;
    
    // Generate random holes
    for (let i = 0; i < numHoles; i++) {
      let x, y;
      let attempts = 0;
      do {
        x = safeZoneLeft + Math.random() * (safeZoneRight - safeZoneLeft);
        y = safeZoneTop + Math.random() * (safeZoneBottom - safeZoneTop);
        attempts++;
      } while (attempts < 50 && obstacles.some(obs => {
        const dist = Math.sqrt(Math.pow(obs.x - x, 2) + Math.pow(obs.y - y, 2));
        return dist < (GAME_CONFIG.HOLE_RADIUS * 3 * Math.min(scaleX, scaleY));
      }));
      
      obstacles.push({
        type: 'hole',
        x,
        y,
        radius: GAME_CONFIG.HOLE_RADIUS * Math.min(scaleX, scaleY),
        permanent: permanent, // Mark if permanent
        id: permanent ? `perm-${Date.now()}-${i}` : null
      });
    }
    
    // Generate random poles
    for (let i = 0; i < numPoles; i++) {
      let x, y;
      let attempts = 0;
      do {
        x = safeZoneLeft + Math.random() * (safeZoneRight - safeZoneLeft);
        y = safeZoneTop + Math.random() * (safeZoneBottom - safeZoneTop);
        attempts++;
      } while (attempts < 50 && obstacles.some(obs => {
        const dist = Math.sqrt(Math.pow(obs.x - x, 2) + Math.pow(obs.y - y, 2));
        const minDist = obs.type === 'hole' 
          ? GAME_CONFIG.HOLE_RADIUS * 2 * Math.min(scaleX, scaleY)
          : Math.max(GAME_CONFIG.POLE_WIDTH * scaleX, GAME_CONFIG.POLE_HEIGHT * scaleY) * 2;
        return dist < minDist;
      }));
      
      obstacles.push({
        type: 'pole',
        x,
        y,
        width: GAME_CONFIG.POLE_WIDTH * scaleX,
        height: GAME_CONFIG.POLE_HEIGHT * scaleY,
        permanent: permanent, // Mark if permanent
        id: permanent ? `perm-${Date.now()}-${i}` : null
      });
    }
    
    return obstacles;
  }, []);

  // Spawn a single random obstacle
  const spawnRandomObstacle = useCallback(() => {
    if (!canvasSize.width || !canvasSize.height) return;
    
    const scaleX = canvasSize.width / GAME_CONFIG.CANVAS_WIDTH;
    const scaleY = canvasSize.height / GAME_CONFIG.CANVAS_HEIGHT;
    const safeZoneTop = 50 * scaleY;
    const safeZoneBottom = canvasSize.height - 50 * scaleY;
    const safeZoneLeft = 100 * scaleX;
    const safeZoneRight = canvasSize.width - 100 * scaleX;
    
    // Randomly choose hole or pole (60% pole, 40% hole)
    const isHole = Math.random() < 0.4;
    let x, y;
    let attempts = 0;
    
    do {
      x = safeZoneLeft + Math.random() * (safeZoneRight - safeZoneLeft);
      y = safeZoneTop + Math.random() * (safeZoneBottom - safeZoneTop);
      attempts++;
    } while (attempts < 50 && obstaclesRef.current.some(obs => {
      const dist = Math.sqrt(Math.pow(obs.x - x, 2) + Math.pow(obs.y - y, 2));
      const minDist = obs.type === 'hole' 
        ? GAME_CONFIG.HOLE_RADIUS * 3 * Math.min(scaleX, scaleY)
        : Math.max(GAME_CONFIG.POLE_WIDTH * scaleX, GAME_CONFIG.POLE_HEIGHT * scaleY) * 3;
      return dist < minDist;
    }));
    
    const newObstacle = isHole ? {
      type: 'hole',
      x,
      y,
      radius: GAME_CONFIG.HOLE_RADIUS * Math.min(scaleX, scaleY),
      permanent: false,
      id: Date.now() + Math.random() // Unique ID for tracking
    } : {
      type: 'pole',
      x,
      y,
      width: GAME_CONFIG.POLE_WIDTH * scaleX,
      height: GAME_CONFIG.POLE_HEIGHT * scaleY,
      permanent: false,
      id: Date.now() + Math.random()
    };
    
    obstaclesRef.current.push(newObstacle);
    setForceUpdate(prev => prev + 1); // Trigger re-render
    
    // Schedule despawn (only for temporary obstacles)
    const despawnTimer = setTimeout(() => {
      obstaclesRef.current = obstaclesRef.current.filter(obs => obs.id !== newObstacle.id);
      setForceUpdate(prev => prev + 1);
    }, GAME_CONFIG.OBSTACLE_DESPAWN_INTERVAL);
    
    obstacleDespawnTimersRef.current.push(despawnTimer);
  }, [canvasSize]);

  // Dynamic obstacle spawning system
  const startDynamicObstacleSystem = useCallback(() => {
    if (!GAME_CONFIG.DYNAMIC_OBSTACLES || !GAME_CONFIG.TEMPORARY_OBSTACLES) return;
    
    // Spawn new temporary obstacles periodically
    obstacleSpawnTimerRef.current = setInterval(() => {
      if (!gameEngineRef.current) return;
      const state = gameEngineRef.current.getState();
      
      // Only spawn during gameplay
      if (state.gameState !== 'playing') return;
      
      // Count only temporary obstacles (not permanent ones)
      const tempObstacleCount = obstaclesRef.current.filter(obs => !obs.permanent).length;
      
      // Don't spawn if we have too many temporary obstacles
      if (tempObstacleCount >= GAME_CONFIG.MAX_TEMPORARY_OBSTACLES) return;
      
      // Random chance to spawn (60% chance)
      if (Math.random() > 0.4) {
        spawnRandomObstacle();
      }
    }, GAME_CONFIG.OBSTACLE_SPAWN_INTERVAL);
  }, [spawnRandomObstacle]);
  
  // Store function in ref to avoid circular dependency
  startDynamicObstacleSystemRef.current = startDynamicObstacleSystem;

  // Initialize obstacles (scaled for mobile) - random each game
  useEffect(() => {
    if (canvasSize.width && canvasSize.height) {
      // Start with ONLY permanent obstacles (creates suspense!)
      const permanentObstacles = generateRandomObstacles(
        canvasSize.width, 
        canvasSize.height, 
        GAME_CONFIG.PERMANENT_OBSTACLES,
        true // Mark as permanent
      );
      obstaclesRef.current = permanentObstacles;
      lastScoreRef.current = { score1: 0, score2: 0 };
      
      // Clear any existing timers
      if (obstacleSpawnTimerRef.current) {
        clearInterval(obstacleSpawnTimerRef.current);
      }
      obstacleDespawnTimersRef.current.forEach(timer => clearTimeout(timer));
      obstacleDespawnTimersRef.current = [];
      
      // Start dynamic obstacle system if enabled (with initial delay for suspense)
      if (GAME_CONFIG.DYNAMIC_OBSTACLES && GAME_CONFIG.TEMPORARY_OBSTACLES) {
        const timerId = setTimeout(() => {
          if (startDynamicObstacleSystemRef.current) {
            startDynamicObstacleSystemRef.current();
          }
        }, GAME_CONFIG.INITIAL_DELAY);
        return () => clearTimeout(timerId);
      }
    }
    
    return () => {
      if (obstacleSpawnTimerRef.current) {
        clearInterval(obstacleSpawnTimerRef.current);
      }
      obstacleDespawnTimersRef.current.forEach(timer => clearTimeout(timer));
      obstacleDespawnTimersRef.current = [];
    };
  }, [canvasSize, generateRandomObstacles]); // Regenerate on game restart

  // Spawn obstacle on score change (with delay for suspense)
  useEffect(() => {
    if (!gameEngineRef.current || !GAME_CONFIG.OBSTACLE_SPAWN_ON_SCORE) return;
    
    const state = gameEngineRef.current.getState();
    const currentScore = { score1: state.score1, score2: state.score2 };
    
    // Check if score changed
    if (currentScore.score1 !== lastScoreRef.current.score1 || 
        currentScore.score2 !== lastScoreRef.current.score2) {
      // Spawn obstacle after score (50% chance, with delay for suspense)
      const tempObstacleCount = obstaclesRef.current.filter(obs => !obs.permanent).length;
      if (Math.random() < 0.5 && tempObstacleCount < GAME_CONFIG.MAX_TEMPORARY_OBSTACLES) {
        setTimeout(() => spawnRandomObstacle(), 1000); // 1 second delay for suspense
      }
      lastScoreRef.current = currentScore;
    }
  }, [forceUpdate, spawnRandomObstacle]);

  // Initialize game engine and AI
  useEffect(() => {
    // Initialize with canvas size (has default values from useState)
    const width = canvasSize.width || GAME_CONFIG.CANVAS_WIDTH;
    const height = canvasSize.height || GAME_CONFIG.CANVAS_HEIGHT;
    
    // Only reinitialize if size changed
    if (gameEngineRef.current && 
        (gameEngineRef.current.canvasWidth !== width || 
         gameEngineRef.current.canvasHeight !== height)) {
      gameEngineRef.current = new GameEngine(width, height);
      
      // Reinitialize AI controller if in AI mode
      if (gameMode === 'ai') {
        aiControllerRef.current = new AIController(aiDifficulty);
      }
    }

    // Set up online mode
    if (gameMode === 'online' && onlineConfig) {
      isHostRef.current = onlineConfig.isHost;
      const playerNumber = onlineConfig.playerNumber;
      const multiplayerType = onlineConfig.multiplayerType || 'firebase';
      const multiplayerManager = multiplayerType === 'firebase' ? firebaseMultiplayer : socketManager;

      // Set up handlers for online mode
      multiplayerManager.on('OpponentPaddleMove', (data) => {
        if (data.playerNumber !== playerNumber) {
          opponentPaddleRef.current = data.x;
          // Update opponent's paddle position
          const engine = gameEngineRef.current;
          if (engine) {
            const opponentPaddle = playerNumber === 1 ? engine.paddle2 : engine.paddle1;
            opponentPaddle.x = data.x;
          }
        }
      });

      multiplayerManager.on('GameStateSync', (data) => {
        // Sync ball position from host
        if (!isHostRef.current && gameEngineRef.current) {
          gameEngineRef.current.ball = { ...data.ball };
        }
      });

      multiplayerManager.on('ScoreSync', (data) => {
        if (gameEngineRef.current) {
          gameEngineRef.current.score1 = data.score1;
          gameEngineRef.current.score2 = data.score2;
          if (onScoreUpdate) {
            onScoreUpdate(data.score1, data.score2);
          }
        }
      });

      multiplayerManager.on('GameOverSync', (data) => {
        if (gameEngineRef.current) {
          gameEngineRef.current.gameState = 'gameOver';
          gameEngineRef.current.winner = data.winner;
          if (onGameOver) {
            onGameOver(data.winner);
          }
        }
      });

      multiplayerManager.on('GameRestart', () => {
        if (gameEngineRef.current) {
          gameEngineRef.current.reset();
        }
      });

      multiplayerManager.on('OpponentDisconnected', () => {
        if (gameEngineRef.current) {
          gameEngineRef.current.gameState = 'paused';
        }
      });
    }

    // Handle keyboard input
    const handleKeyDown = (e) => {
      keysRef.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [gameMode, aiDifficulty, onlineConfig, onScoreUpdate, onGameOver, canvasSize]);

  // Render function for canvas
  const render = useCallback((ctx, state) => {
    if (!ctx) return;
    
    const { width, height } = canvasSize;
    
    // Clear canvas
    ctx.fillStyle = GAME_CONFIG.COLORS.BACKGROUND;
    ctx.fillRect(0, 0, width, height);
    
    // Draw goal lines
    ctx.fillStyle = GAME_CONFIG.COLORS.GOAL_LINE;
    ctx.shadowBlur = 10;
    ctx.shadowColor = GAME_CONFIG.COLORS.GOAL_LINE;
    ctx.fillRect(0, 0, width, 3);
    ctx.fillRect(0, height - 3, width, 3);
    ctx.shadowBlur = 0;
    
    // Draw center line
    ctx.strokeStyle = GAME_CONFIG.COLORS.OBSTACLE;
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
    
    // Draw obstacles
    // Only show holes after first paddle hit (hitCount > 0)
    if (GAME_CONFIG.OBSTACLES_ENABLED && obstaclesRef.current) {
      obstaclesRef.current.forEach(obstacle => {
        if (obstacle.type === 'hole') {
          // Only render holes if ball has been hit at least once
          if (state.hitCount === 0) {
            return; // Don't render holes until first hit
          }
          // Draw hole with bright, visible border
          // Outer glow ring
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#ff4444';
          ctx.strokeStyle = '#ff6666';
          ctx.lineWidth = 4;
          ctx.setLineDash([10, 5]);
          ctx.beginPath();
          ctx.arc(obstacle.x, obstacle.y, obstacle.radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.shadowBlur = 0;
          
          // Inner dark center to show depth
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.beginPath();
          ctx.arc(obstacle.x, obstacle.y, obstacle.radius * 0.9, 0, Math.PI * 2);
          ctx.fill();
          
          // Bright warning border
          ctx.strokeStyle = '#ff4444';
          ctx.lineWidth = 3;
          ctx.setLineDash([8, 4]);
          ctx.beginPath();
          ctx.arc(obstacle.x, obstacle.y, obstacle.radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        } else if (obstacle.type === 'pole') {
          ctx.fillStyle = GAME_CONFIG.COLORS.OBSTACLE;
          ctx.strokeStyle = GAME_CONFIG.COLORS.BALL;
          ctx.lineWidth = 2;
          ctx.shadowBlur = 10;
          ctx.shadowColor = GAME_CONFIG.COLORS.OBSTACLE;
          ctx.fillRect(obstacle.x - obstacle.width / 2, obstacle.y - obstacle.height / 2, obstacle.width, obstacle.height);
          ctx.strokeRect(obstacle.x - obstacle.width / 2, obstacle.y - obstacle.height / 2, obstacle.width, obstacle.height);
          ctx.shadowBlur = 0;
        }
      });
    }
    
    // Draw paddles
    const paddle1 = state.paddle1;
    const paddle2 = state.paddle2;
    
    // Helper function for rounded rectangles
    const roundRect = (x, y, w, h, r) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };
    
    // Paddle 1 (top)
    ctx.fillStyle = gameMode === 'ai' ? '#533483' : GAME_CONFIG.COLORS.PADDLE;
    ctx.strokeStyle = GAME_CONFIG.COLORS.BALL;
    ctx.lineWidth = 2;
    ctx.shadowBlur = gameMode === 'ai' ? 20 : 15;
    ctx.shadowColor = gameMode === 'ai' ? '#533483' : GAME_CONFIG.COLORS.PADDLE;
    roundRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height, 8);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    if (gameMode === 'ai') {
      ctx.fillStyle = GAME_CONFIG.COLORS.TEXT;
      ctx.font = 'bold 10px Rajdhani';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.globalAlpha = 0.8;
      ctx.fillText('AI', paddle1.x + paddle1.width / 2, paddle1.y + paddle1.height / 2);
      ctx.globalAlpha = 1;
    }
    
    // Paddle 2 (bottom)
    ctx.fillStyle = GAME_CONFIG.COLORS.PADDLE;
    ctx.strokeStyle = GAME_CONFIG.COLORS.BALL;
    ctx.shadowBlur = 15;
    ctx.shadowColor = GAME_CONFIG.COLORS.PADDLE;
    roundRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height, 8);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Draw ball
    const ball = state.ball;
    ctx.fillStyle = GAME_CONFIG.COLORS.BALL;
    ctx.shadowBlur = 10;
    ctx.shadowColor = GAME_CONFIG.COLORS.BALL;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }, [canvasSize, gameMode]);

  // Game loop
  const gameLoop = useCallback(() => {
    if (!gameEngineRef.current) return;

    const engine = gameEngineRef.current;
    const currentState = engine.getState();
    
    // Render to canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      render(ctx, currentState);
    }

    // Handle paddle movement based on game mode
    if (gameMode === '2player') {
      // Player 1 (top): A/D keys or touch
      const player1Dir = keysRef.current['a'] ? -1 : keysRef.current['d'] ? 1 : touchDirectionRef.current.player1;
      if (player1Dir !== 0) {
        engine.updatePaddle(1, player1Dir);
      }

      // Player 2 (bottom): Arrow Left/Right keys or touch
      const player2Dir = keysRef.current['arrowleft'] ? -1 : keysRef.current['arrowright'] ? 1 : touchDirectionRef.current.player2;
      if (player2Dir !== 0) {
        engine.updatePaddle(2, player2Dir);
      }
    } else if (gameMode === 'ai') {
      // Player controls bottom paddle (Player 2)
      const player2Dir = keysRef.current['arrowleft'] ? -1 : keysRef.current['arrowright'] ? 1 : touchDirectionRef.current.player2;
      if (player2Dir !== 0) {
        engine.updatePaddle(2, player2Dir);
      }

      // AI controls top paddle (Player 1)
      if (aiControllerRef.current && currentState.gameState === 'playing') {
        // Ensure AI controller is initialized
        if (!aiControllerRef.current) {
          aiControllerRef.current = new AIController(aiDifficulty);
        }
        const aiDirection = aiControllerRef.current.getMovement(
          currentState.ball,
          currentState.paddle1,
          canvasSize.width || GAME_CONFIG.CANVAS_WIDTH,
          canvasSize.height || GAME_CONFIG.CANVAS_HEIGHT,
          true // isTopPaddle
        );
        if (aiDirection !== 0) {
          engine.updatePaddle(1, aiDirection);
        }
      }
    } else if (gameMode === 'online' && onlineConfig) {
      const playerNumber = onlineConfig.playerNumber;
      const multiplayerType = onlineConfig.multiplayerType || 'firebase';
      const multiplayerManager = multiplayerType === 'firebase' ? firebaseMultiplayer : socketManager;
      const myPaddle = playerNumber === 1 ? engine.paddle1 : engine.paddle2;
      const prevX = lastPaddleXRef.current;

      // Handle local player input
      if (playerNumber === 1) {
        // Player 1 (top): A/D keys or touch
        const player1Dir = keysRef.current['a'] ? -1 : keysRef.current['d'] ? 1 : touchDirectionRef.current.player1;
        if (player1Dir !== 0) {
          engine.updatePaddle(1, player1Dir);
        }
      } else {
        // Player 2 (bottom): Arrow Left/Right keys or touch
        const player2Dir = keysRef.current['arrowleft'] ? -1 : keysRef.current['arrowright'] ? 1 : touchDirectionRef.current.player2;
        if (player2Dir !== 0) {
          engine.updatePaddle(2, player2Dir);
        }
      }

      // Send paddle position if it changed
      if (prevX !== myPaddle.x) {
        multiplayerManager.sendPaddleMove(myPaddle.x, myPaddle.x > (prevX || 0) ? 1 : -1);
        lastPaddleXRef.current = myPaddle.x;
      }
    }

    // Update ball (only host updates in online mode)
    if (gameMode !== 'online' || isHostRef.current) {
      engine.updateBall(obstaclesRef.current);
    }

    // Get updated state after ball update
    const updatedState = engine.getState();

    // Sync game state in online mode (host sends updates)
    if (gameMode === 'online' && onlineConfig && isHostRef.current && updatedState.gameState === 'playing') {
      const multiplayerType = onlineConfig.multiplayerType || 'firebase';
      const multiplayerManager = multiplayerType === 'firebase' ? firebaseMultiplayer : socketManager;
      multiplayerManager.sendGameStateUpdate({
        ball: updatedState.ball
      });
    }

    // Notify parent of score changes
    if (onScoreUpdate) {
      onScoreUpdate(updatedState.score1, updatedState.score2);
    }

    // Sync score in online mode (host sends updates)
    if (gameMode === 'online' && onlineConfig && isHostRef.current) {
      const multiplayerType = onlineConfig.multiplayerType || 'firebase';
      const multiplayerManager = multiplayerType === 'firebase' ? firebaseMultiplayer : socketManager;
      multiplayerManager.sendScoreUpdate(updatedState.score1, updatedState.score2);
    }

    // Check for game over - check every frame to catch game over state
    if (updatedState.gameState === 'gameOver' && updatedState.winner !== null) {
      if (onGameOver) {
        if (gameMode === 'online' && onlineConfig && isHostRef.current) {
          const multiplayerType = onlineConfig.multiplayerType || 'firebase';
          const multiplayerManager = multiplayerType === 'firebase' ? firebaseMultiplayer : socketManager;
          multiplayerManager.sendGameOver(updatedState.winner);
        }
        onGameOver(updatedState.winner);
      }
    }
    // Game loop continuation is handled by useEffect
  }, [onScoreUpdate, onGameOver, gameMode, aiDifficulty, onlineConfig, render]);

  // Start game loop
  useEffect(() => {
    let running = true;
    
    const loop = () => {
      if (!running) return;
      gameLoop();
      if (running) {
        animationFrameRef.current = requestAnimationFrame(loop);
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      running = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameLoop]);

  // Handle pause and start
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        if (gameEngineRef.current) {
          const state = gameEngineRef.current.getState();
          // If ready, start the game
          if (state.gameState === 'ready') {
            gameEngineRef.current.start();
            setForceUpdate(prev => prev + 1); // Force re-render
          } else {
            // Otherwise, toggle pause
            gameEngineRef.current.pause();
            setForceUpdate(prev => prev + 1); // Force re-render
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleTouchMove = useCallback((direction, playerNumber) => {
    touchDirectionRef.current[`player${playerNumber}`] = direction;
  }, []);

  // Ensure game engine is initialized (fallback for production)
  if (!gameEngineRef.current) {
    const width = canvasSize.width || GAME_CONFIG.CANVAS_WIDTH;
    const height = canvasSize.height || GAME_CONFIG.CANVAS_HEIGHT;
    gameEngineRef.current = new GameEngine(width, height);
  }

  const state = gameEngineRef.current.getState();

  // Initialize canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;
      const ctx = canvas.getContext('2d');
      if (ctx && gameEngineRef.current) {
        render(ctx, gameEngineRef.current.getState());
      }
    }
  }, [canvasSize, render]);

  return (
    <>
      <div style={{ 
        position: 'relative', 
        display: 'inline-block',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}>
        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
            border: `3px solid ${GAME_CONFIG.COLORS.GOAL_LINE}`,
            borderRadius: '10px',
            boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)',
            maxWidth: '100%',
            width: '100%',
            height: 'auto',
            touchAction: 'none', // Prevent default touch behaviors on canvas
            boxSizing: 'border-box'
          }}
        />

      {/* Start screen overlay */}
      {state.gameState === 'ready' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: canvasSize.width,
            height: canvasSize.height,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: GAME_CONFIG.COLORS.TEXT,
            zIndex: 1000,
            borderRadius: '10px',
            padding: '20px'
          }}
        >
          <div style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            marginBottom: '15px',
            textAlign: 'center',
            padding: '0 10px'
          }}>
            Ready to Play?
          </div>
          <button
            onClick={() => {
              if (gameEngineRef.current) {
                gameEngineRef.current.start();
                setForceUpdate(prev => prev + 1); // Force re-render
              }
            }}
            style={{
              padding: '12px 25px',
              fontSize: '18px',
              fontWeight: 'bold',
              backgroundColor: GAME_CONFIG.COLORS.BALL,
              color: GAME_CONFIG.COLORS.TEXT,
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              boxShadow: `0 0 20px ${GAME_CONFIG.COLORS.BALL}`,
              transition: 'transform 0.2s',
              touchAction: 'manipulation'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
          >
            START GAME
          </button>
          <div style={{ 
            marginTop: '15px', 
            fontSize: '12px', 
            opacity: 0.7,
            textAlign: 'center',
            padding: '0 10px'
          }}>
            Press Space or Esc to pause during game
          </div>
        </div>
      )}
      
      {/* Pause overlay */}
      {state.gameState === 'paused' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: canvasSize.width,
            height: canvasSize.height,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: GAME_CONFIG.COLORS.TEXT,
            fontSize: '24px',
            fontWeight: 'bold',
            zIndex: 1000,
            borderRadius: '10px',
            padding: '20px'
          }}
        >
          <div style={{ marginBottom: '15px' }}>PAUSED</div>
          <button
            onClick={() => {
              if (gameEngineRef.current) {
                gameEngineRef.current.pause(); // Toggle pause
              }
            }}
            style={{
              padding: '10px 25px',
              fontSize: '16px',
              backgroundColor: GAME_CONFIG.COLORS.BALL,
              color: GAME_CONFIG.COLORS.TEXT,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              touchAction: 'manipulation'
            }}
          >
            RESUME
          </button>
        </div>
      )}
    </div>
    <TouchControls
      onMovePlayer1={(direction) => handleTouchMove(direction, 1)}
      onMovePlayer2={(direction) => handleTouchMove(direction, 2)}
      playerNumber={onlineConfig?.playerNumber || (gameMode === 'ai' ? 2 : null)}
      gameMode={gameMode}
    />
    </>
  );
};

export default GameBoard;

