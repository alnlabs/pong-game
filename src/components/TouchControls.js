import React from 'react';
import { GAME_CONFIG } from '../config/gameConfig';

const TouchControls = ({ onMovePlayer1, onMovePlayer2, playerNumber, gameMode }) => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
  
  if (!isMobile) {
    return null;
  }

  const handleTouchStart = (direction, targetPlayer) => {
    if (targetPlayer === 1 && onMovePlayer1) {
      onMovePlayer1(direction);
    } else if (targetPlayer === 2 && onMovePlayer2) {
      onMovePlayer2(direction);
    }
  };

  const handleTouchEnd = (targetPlayer) => {
    if (targetPlayer === 1 && onMovePlayer1) {
      onMovePlayer1(0);
    } else if (targetPlayer === 2 && onMovePlayer2) {
      onMovePlayer2(0);
    }
  };

  // For 2-player mode, show controls for both players
  // For AI/Online mode, only show controls for the player's paddle
  const showPlayer1Controls = gameMode === '2player' || (gameMode === 'online' && playerNumber === 1);
  const showPlayer2Controls = gameMode === '2player' || gameMode === 'ai' || (gameMode === 'online' && playerNumber === 2);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-around',
        padding: '20px',
        zIndex: 100,
        pointerEvents: 'none'
      }}
    >
      {/* Player 2 (Bottom) Controls */}
      {showPlayer2Controls && (
        <div
          style={{
            display: 'flex',
            gap: '15px',
            pointerEvents: 'auto'
          }}
        >
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              handleTouchStart(-1, 2);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleTouchEnd(2);
            }}
            onMouseDown={() => handleTouchStart(-1, 2)}
            onMouseUp={() => handleTouchEnd(2)}
            onMouseLeave={() => handleTouchEnd(2)}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: GAME_CONFIG.COLORS.PADDLE,
              border: `3px solid ${GAME_CONFIG.COLORS.BALL}`,
              color: GAME_CONFIG.COLORS.TEXT,
              fontSize: '32px',
              fontWeight: 'bold',
              cursor: 'pointer',
              userSelect: 'none',
              touchAction: 'manipulation',
              boxShadow: `0 4px 15px rgba(0, 0, 0, 0.3)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ←
          </button>
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              handleTouchStart(1, 2);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleTouchEnd(2);
            }}
            onMouseDown={() => handleTouchStart(1, 2)}
            onMouseUp={() => handleTouchEnd(2)}
            onMouseLeave={() => handleTouchEnd(2)}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: GAME_CONFIG.COLORS.PADDLE,
              border: `3px solid ${GAME_CONFIG.COLORS.BALL}`,
              color: GAME_CONFIG.COLORS.TEXT,
              fontSize: '32px',
              fontWeight: 'bold',
              cursor: 'pointer',
              userSelect: 'none',
              touchAction: 'manipulation',
              boxShadow: `0 4px 15px rgba(0, 0, 0, 0.3)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            →
          </button>
        </div>
      )}

      {/* Player 1 (Top) Controls - shown at top for 2-player mode */}
      {showPlayer1Controls && gameMode === '2player' && (
        <div
          style={{
            position: 'fixed',
            top: '100px',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'space-around',
            padding: '20px',
            zIndex: 100,
            pointerEvents: 'auto'
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '15px'
            }}
          >
            <button
              onTouchStart={(e) => {
                e.preventDefault();
                handleTouchStart(-1, 1);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                handleTouchEnd(1);
              }}
              onMouseDown={() => handleTouchStart(-1, 1)}
              onMouseUp={() => handleTouchEnd(1)}
              onMouseLeave={() => handleTouchEnd(1)}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: GAME_CONFIG.COLORS.PADDLE,
                border: `3px solid ${GAME_CONFIG.COLORS.BALL}`,
                color: GAME_CONFIG.COLORS.TEXT,
                fontSize: '32px',
                fontWeight: 'bold',
                cursor: 'pointer',
                userSelect: 'none',
                touchAction: 'manipulation',
                boxShadow: `0 4px 15px rgba(0, 0, 0, 0.3)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ←
            </button>
            <button
              onTouchStart={(e) => {
                e.preventDefault();
                handleTouchStart(1, 1);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                handleTouchEnd();
              }}
              onMouseDown={() => handleTouchStart(1, 1)}
              onMouseUp={handleTouchEnd}
              onMouseLeave={handleTouchEnd}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: GAME_CONFIG.COLORS.PADDLE,
                border: `3px solid ${GAME_CONFIG.COLORS.BALL}`,
                color: GAME_CONFIG.COLORS.TEXT,
                fontSize: '32px',
                fontWeight: 'bold',
                cursor: 'pointer',
                userSelect: 'none',
                touchAction: 'manipulation',
                boxShadow: `0 4px 15px rgba(0, 0, 0, 0.3)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TouchControls;

