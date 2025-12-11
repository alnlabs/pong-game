import React from 'react';
import { GAME_CONFIG } from '../config/gameConfig';

const Instructions = ({ gameMode = '2player' }) => {
  const isMobile = window.innerWidth < 768;
  
  return (
    <div
      style={{
        width: isMobile ? '100%' : GAME_CONFIG.CANVAS_WIDTH,
        maxWidth: '100%',
        padding: isMobile ? '12px' : '20px',
        color: GAME_CONFIG.COLORS.TEXT,
        fontSize: isMobile ? '12px' : '14px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: GAME_CONFIG.COLORS.BACKGROUND,
        borderRadius: '10px',
        marginTop: isMobile ? '10px' : '20px',
        opacity: 0.9
      }}
    >
      <div style={{ marginBottom: isMobile ? '10px' : '15px', fontSize: isMobile ? '16px' : '18px', fontWeight: 'bold', textAlign: isMobile ? 'center' : 'left' }}>
        How to Play:
      </div>
      <div style={{ lineHeight: isMobile ? '1.6' : '1.8' }}>
        {gameMode === '2player' ? (
          <>
            <div style={{ marginBottom: isMobile ? '6px' : '8px' }}>
              <strong>Player 1 (Top):</strong> Use <kbd style={{ padding: isMobile ? '1px 4px' : '2px 6px', backgroundColor: '#333', borderRadius: '3px', fontSize: isMobile ? '11px' : '12px' }}>A</kbd> and <kbd style={{ padding: isMobile ? '1px 4px' : '2px 6px', backgroundColor: '#333', borderRadius: '3px', fontSize: isMobile ? '11px' : '12px' }}>D</kbd> keys to move
            </div>
            <div style={{ marginBottom: isMobile ? '6px' : '8px' }}>
              <strong>Player 2 (Bottom):</strong> Use <kbd style={{ padding: isMobile ? '1px 4px' : '2px 6px', backgroundColor: '#333', borderRadius: '3px', fontSize: isMobile ? '11px' : '12px' }}>←</kbd> and <kbd style={{ padding: isMobile ? '1px 4px' : '2px 6px', backgroundColor: '#333', borderRadius: '3px', fontSize: isMobile ? '11px' : '12px' }}>→</kbd> arrow keys to move
            </div>
          </>
        ) : gameMode === 'ai' ? (
          <div style={{ marginBottom: isMobile ? '6px' : '8px' }}>
            <strong>You (Bottom):</strong> Use <kbd style={{ padding: isMobile ? '1px 4px' : '2px 6px', backgroundColor: '#333', borderRadius: '3px', fontSize: isMobile ? '11px' : '12px' }}>←</kbd> and <kbd style={{ padding: isMobile ? '1px 4px' : '2px 6px', backgroundColor: '#333', borderRadius: '3px', fontSize: isMobile ? '11px' : '12px' }}>→</kbd> arrow keys to move. The AI controls the top paddle.
          </div>
        ) : gameMode === 'online' ? (
          <>
            <div style={{ marginBottom: isMobile ? '6px' : '8px' }}>
              <strong>Player 1 (Top):</strong> Use <kbd style={{ padding: isMobile ? '1px 4px' : '2px 6px', backgroundColor: '#333', borderRadius: '3px', fontSize: isMobile ? '11px' : '12px' }}>A</kbd> and <kbd style={{ padding: isMobile ? '1px 4px' : '2px 6px', backgroundColor: '#333', borderRadius: '3px', fontSize: isMobile ? '11px' : '12px' }}>D</kbd> keys to move
            </div>
            <div style={{ marginBottom: isMobile ? '6px' : '8px' }}>
              <strong>Player 2 (Bottom):</strong> Use <kbd style={{ padding: isMobile ? '1px 4px' : '2px 6px', backgroundColor: '#333', borderRadius: '3px', fontSize: isMobile ? '11px' : '12px' }}>←</kbd> and <kbd style={{ padding: isMobile ? '1px 4px' : '2px 6px', backgroundColor: '#333', borderRadius: '3px', fontSize: isMobile ? '11px' : '12px' }}>→</kbd> arrow keys to move
            </div>
            <div style={{ marginTop: isMobile ? '8px' : '10px', color: GAME_CONFIG.COLORS.BALL, fontSize: isMobile ? '11px' : '12px' }}>
              <strong>Note:</strong> Play against an opponent online! Create or join a room to start.
            </div>
          </>
        ) : null}
        <div style={{ marginBottom: isMobile ? '6px' : '8px' }}>
          <strong>Pause:</strong> Press <kbd style={{ padding: isMobile ? '1px 4px' : '2px 6px', backgroundColor: '#333', borderRadius: '3px', fontSize: isMobile ? '11px' : '12px' }}>Space</kbd> or <kbd style={{ padding: isMobile ? '1px 4px' : '2px 6px', backgroundColor: '#333', borderRadius: '3px', fontSize: isMobile ? '11px' : '12px' }}>Esc</kbd>
        </div>
        {/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768 ? (
          <div style={{ marginTop: isMobile ? '8px' : '10px', marginBottom: isMobile ? '6px' : '8px', color: GAME_CONFIG.COLORS.BALL, fontSize: isMobile ? '11px' : '12px' }}>
            <strong>Mobile:</strong> Use the on-screen arrow buttons to control your paddle!
          </div>
        ) : null}
        <div style={{ marginTop: isMobile ? '8px' : '10px', marginBottom: isMobile ? '6px' : '8px', color: GAME_CONFIG.COLORS.BALL, fontSize: isMobile ? '11px' : '12px' }}>
          <strong>Goal:</strong> Hit the ball to score on the opposite side. First to {GAME_CONFIG.WIN_SCORE} wins!
        </div>
        <div style={{ marginTop: isMobile ? '8px' : '10px', color: GAME_CONFIG.COLORS.OBSTACLE, fontSize: isMobile ? '11px' : '12px' }}>
          <strong>Watch out:</strong> Holes will reset the ball, poles will reflect it!
        </div>
      </div>
    </div>
  );
};

export default Instructions;

