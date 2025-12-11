import React, { useEffect, useRef, useCallback, useState } from 'react';
import { GameEngine } from '../engine/GameEngine';
import { AIController } from '../engine/AIController';
import socketManager from '../utils/socketManager';
import firebaseMultiplayer from '../utils/firebaseMultiplayer';
import { GAME_CONFIG } from '../config/gameConfig';
import Ball from './Ball';
import Paddle from './Paddle';
import Obstacles from './Obstacles';
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
  
  // Initialize game engine immediately with default size
  useEffect(() => {
    if (!gameEngineRef.current) {
      gameEngineRef.current = new GameEngine(
        GAME_CONFIG.CANVAS_WIDTH,
        GAME_CONFIG.CANVAS_HEIGHT
      );
      
      // Initialize AI controller if in AI mode
      if (gameMode === 'ai') {
        aiControllerRef.current = new AIController(aiDifficulty);
      }
    }
  }, []); // Run only once on mount

  // Calculate responsive canvas size
  useEffect(() => {
    const updateCanvasSize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        const maxWidth = window.innerWidth - 40; // Account for padding
        const aspectRatio = GAME_CONFIG.CANVAS_HEIGHT / GAME_CONFIG.CANVAS_WIDTH;
        const width = Math.min(maxWidth, GAME_CONFIG.CANVAS_WIDTH);
        const height = width * aspectRatio;
        setCanvasSize({ width, height });
      } else {
        setCanvasSize({ width: GAME_CONFIG.CANVAS_WIDTH, height: GAME_CONFIG.CANVAS_HEIGHT });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Initialize obstacles (scaled for mobile)
  useEffect(() => {
    const scaleX = canvasSize.width / GAME_CONFIG.CANVAS_WIDTH;
    const scaleY = canvasSize.height / GAME_CONFIG.CANVAS_HEIGHT;
    
    obstaclesRef.current = [
      // Holes
      { type: 'hole', x: 200 * scaleX, y: 200 * scaleY, radius: GAME_CONFIG.HOLE_RADIUS * Math.min(scaleX, scaleY) },
      { type: 'hole', x: 600 * scaleX, y: 400 * scaleY, radius: GAME_CONFIG.HOLE_RADIUS * Math.min(scaleX, scaleY) },
      // Poles
      { type: 'pole', x: 400 * scaleX, y: 150 * scaleY, width: GAME_CONFIG.POLE_WIDTH * scaleX, height: GAME_CONFIG.POLE_HEIGHT * scaleY },
      { type: 'pole', x: 400 * scaleX, y: 450 * scaleY, width: GAME_CONFIG.POLE_WIDTH * scaleX, height: GAME_CONFIG.POLE_HEIGHT * scaleY },
      { type: 'pole', x: 150 * scaleX, y: 300 * scaleY, width: GAME_CONFIG.POLE_WIDTH * scaleX, height: GAME_CONFIG.POLE_HEIGHT * scaleY },
      { type: 'pole', x: 650 * scaleX, y: 300 * scaleY, width: GAME_CONFIG.POLE_WIDTH * scaleX, height: GAME_CONFIG.POLE_HEIGHT * scaleY }
    ];
  }, [canvasSize]);

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

  // Game loop
  const gameLoop = useCallback(() => {
    if (!gameEngineRef.current) return;

    const engine = gameEngineRef.current;
    const currentState = engine.getState();

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
        const aiDirection = aiControllerRef.current.getMovement(
          currentState.ball,
          currentState.paddle1,
          GAME_CONFIG.CANVAS_WIDTH,
          GAME_CONFIG.CANVAS_HEIGHT,
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

    // Check for game over
    if (updatedState.gameState === 'gameOver' && onGameOver) {
      if (gameMode === 'online' && onlineConfig && isHostRef.current) {
        const multiplayerType = onlineConfig.multiplayerType || 'firebase';
        const multiplayerManager = multiplayerType === 'firebase' ? firebaseMultiplayer : socketManager;
        multiplayerManager.sendGameOver(updatedState.winner);
      }
      onGameOver(updatedState.winner);
    }
    // Game loop continuation is handled by useEffect
  }, [onScoreUpdate, onGameOver, gameMode, aiDifficulty, onlineConfig]);

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

  return (
    <>
      <div
        ref={canvasRef}
        style={{
          position: 'relative',
          width: canvasSize.width,
          height: canvasSize.height,
          backgroundColor: GAME_CONFIG.COLORS.BACKGROUND,
          border: `3px solid ${GAME_CONFIG.COLORS.GOAL_LINE}`,
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)',
          maxWidth: '100%',
          margin: '0 auto'
        }}
      >
      {/* Goal lines */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          backgroundColor: GAME_CONFIG.COLORS.GOAL_LINE,
          boxShadow: `0 0 10px ${GAME_CONFIG.COLORS.GOAL_LINE}`
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '3px',
          backgroundColor: GAME_CONFIG.COLORS.GOAL_LINE,
          boxShadow: `0 0 10px ${GAME_CONFIG.COLORS.GOAL_LINE}`
        }}
      />

      {/* Center line */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: '2px',
          backgroundColor: GAME_CONFIG.COLORS.OBSTACLE,
          opacity: 0.3,
          transform: 'translateY(-50%)'
        }}
      />

      {/* Obstacles */}
      <Obstacles obstacles={obstaclesRef.current} />

      {/* Paddles */}
      <Paddle
        x={state.paddle1.x}
        y={state.paddle1.y}
        width={state.paddle1.width}
        height={state.paddle1.height}
        isTop={true}
        isAI={gameMode === 'ai'}
      />
      <Paddle
        x={state.paddle2.x}
        y={state.paddle2.y}
        width={state.paddle2.width}
        height={state.paddle2.height}
        isTop={false}
        isAI={false}
      />

      {/* Ball */}
      <Ball
        x={state.ball.x}
        y={state.ball.y}
        size={state.ball.size}
      />

      {/* Start screen overlay */}
      {state.gameState === 'ready' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: GAME_CONFIG.COLORS.TEXT,
            zIndex: 1000
          }}
        >
          <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '20px' }}>
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
              padding: '15px 40px',
              fontSize: '24px',
              fontWeight: 'bold',
              backgroundColor: GAME_CONFIG.COLORS.BALL,
              color: GAME_CONFIG.COLORS.TEXT,
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              boxShadow: `0 0 20px ${GAME_CONFIG.COLORS.BALL}`,
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
          >
            START GAME
          </button>
          <div style={{ marginTop: '20px', fontSize: '14px', opacity: 0.7 }}>
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
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: GAME_CONFIG.COLORS.TEXT,
            fontSize: '32px',
            fontWeight: 'bold',
            zIndex: 1000
          }}
        >
          <div style={{ marginBottom: '20px' }}>PAUSED</div>
          <button
            onClick={() => {
              if (gameEngineRef.current) {
                gameEngineRef.current.pause(); // Toggle pause
              }
            }}
            style={{
              padding: '10px 30px',
              fontSize: '18px',
              backgroundColor: GAME_CONFIG.COLORS.BALL,
              color: GAME_CONFIG.COLORS.TEXT,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
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

