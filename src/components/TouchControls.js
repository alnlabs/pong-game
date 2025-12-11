import React, { useState, useEffect } from 'react';
import { GAME_CONFIG } from '../config/gameConfig';

const TouchControls = ({ onMovePlayer1, onMovePlayer2, playerNumber, gameMode }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    // Check on mount
    checkMobile();

    // Listen for resize events
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);
  
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

  const buttonSize = window.innerWidth < 480 ? '60px' : '70px';
  const buttonFontSize = window.innerWidth < 480 ? '24px' : '28px';
  const bottomPadding = window.innerWidth < 480 ? '15px' : '20px';
  const safeAreaBottom = `max(${bottomPadding}, env(safe-area-inset-bottom))`;
  
  return (
    <div
      className="touch-controls-container"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: isMobile ? 'flex' : 'none',
        justifyContent: 'space-around',
        padding: `${bottomPadding} ${bottomPadding} ${safeAreaBottom} ${bottomPadding}`,
        zIndex: 100,
        pointerEvents: 'none'
      }}
    >
      {/* Player 2 (Bottom) Controls */}
      {showPlayer2Controls && (
        <div
          style={{
            display: 'flex',
            gap: window.innerWidth < 480 ? '12px' : '15px',
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
              width: buttonSize,
              height: buttonSize,
              borderRadius: '50%',
              backgroundColor: GAME_CONFIG.COLORS.PADDLE,
              border: `3px solid ${GAME_CONFIG.COLORS.BALL}`,
              color: GAME_CONFIG.COLORS.TEXT,
              fontSize: buttonFontSize,
              fontWeight: 'bold',
              cursor: 'pointer',
              userSelect: 'none',
              touchAction: 'manipulation',
              boxShadow: `0 4px 15px rgba(0, 0, 0, 0.3)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              WebkitTapHighlightColor: 'transparent'
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
              width: buttonSize,
              height: buttonSize,
              borderRadius: '50%',
              backgroundColor: GAME_CONFIG.COLORS.PADDLE,
              border: `3px solid ${GAME_CONFIG.COLORS.BALL}`,
              color: GAME_CONFIG.COLORS.TEXT,
              fontSize: buttonFontSize,
              fontWeight: 'bold',
              cursor: 'pointer',
              userSelect: 'none',
              touchAction: 'manipulation',
              boxShadow: `0 4px 15px rgba(0, 0, 0, 0.3)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              WebkitTapHighlightColor: 'transparent'
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
            top: window.innerWidth < 480 ? '80px' : '100px',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'space-around',
            padding: `${window.innerWidth < 480 ? '15px' : '20px'} ${bottomPadding} ${bottomPadding} ${bottomPadding}`,
            paddingTop: `max(${window.innerWidth < 480 ? '15px' : '20px'}, env(safe-area-inset-top))`,
            zIndex: 100,
            pointerEvents: 'auto'
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: window.innerWidth < 480 ? '12px' : '15px'
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
                width: buttonSize,
                height: buttonSize,
                borderRadius: '50%',
                backgroundColor: GAME_CONFIG.COLORS.PADDLE,
                border: `3px solid ${GAME_CONFIG.COLORS.BALL}`,
                color: GAME_CONFIG.COLORS.TEXT,
                fontSize: buttonFontSize,
                fontWeight: 'bold',
                cursor: 'pointer',
                userSelect: 'none',
                touchAction: 'manipulation',
                boxShadow: `0 4px 15px rgba(0, 0, 0, 0.3)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                WebkitTapHighlightColor: 'transparent'
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
                handleTouchEnd(1);
              }}
              onMouseDown={() => handleTouchStart(1, 1)}
              onMouseUp={() => handleTouchEnd(1)}
              onMouseLeave={() => handleTouchEnd(1)}
              style={{
                width: buttonSize,
                height: buttonSize,
                borderRadius: '50%',
                backgroundColor: GAME_CONFIG.COLORS.PADDLE,
                border: `3px solid ${GAME_CONFIG.COLORS.BALL}`,
                color: GAME_CONFIG.COLORS.TEXT,
                fontSize: buttonFontSize,
                fontWeight: 'bold',
                cursor: 'pointer',
                userSelect: 'none',
                touchAction: 'manipulation',
                boxShadow: `0 4px 15px rgba(0, 0, 0, 0.3)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                WebkitTapHighlightColor: 'transparent'
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

