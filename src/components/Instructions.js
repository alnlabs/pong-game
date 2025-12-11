import React from 'react';
import { GAME_CONFIG } from '../config/gameConfig';

const Instructions = ({ gameMode = '2player' }) => {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '100%',
        padding: '12px',
        color: GAME_CONFIG.COLORS.TEXT,
        fontSize: '12px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: GAME_CONFIG.COLORS.BACKGROUND,
        borderRadius: '10px',
        marginTop: '10px',
        opacity: 0.9,
        boxSizing: 'border-box'
      }}
    >
      <div style={{ marginBottom: '10px', fontSize: '16px', fontWeight: 'bold', textAlign: 'center' }}>
        How to Play:
      </div>
      <div style={{ lineHeight: '1.6' }}>
        {gameMode === '2player' ? (
          <>
            <div style={{ marginBottom: '6px' }}>
              <strong>Player 1 (Top):</strong> Use <kbd style={{ padding: '1px 4px', backgroundColor: '#333', borderRadius: '3px', fontSize: '11px' }}>A</kbd> and <kbd style={{ padding: '1px 4px', backgroundColor: '#333', borderRadius: '3px', fontSize: '11px' }}>D</kbd> keys to move
            </div>
            <div style={{ marginBottom: '6px' }}>
              <strong>Player 2 (Bottom):</strong> Use <kbd style={{ padding: '1px 4px', backgroundColor: '#333', borderRadius: '3px', fontSize: '11px' }}>←</kbd> and <kbd style={{ padding: '1px 4px', backgroundColor: '#333', borderRadius: '3px', fontSize: '11px' }}>→</kbd> arrow keys to move
            </div>
          </>
        ) : gameMode === 'ai' ? (
          <div style={{ marginBottom: '6px' }}>
            <strong>You (Bottom):</strong> Use <kbd style={{ padding: '1px 4px', backgroundColor: '#333', borderRadius: '3px', fontSize: '11px' }}>←</kbd> and <kbd style={{ padding: '1px 4px', backgroundColor: '#333', borderRadius: '3px', fontSize: '11px' }}>→</kbd> arrow keys to move. The AI controls the top paddle.
          </div>
        ) : gameMode === 'online' ? (
          <>
            <div style={{ marginBottom: '6px' }}>
              <strong>Player 1 (Top):</strong> Use <kbd style={{ padding: '1px 4px', backgroundColor: '#333', borderRadius: '3px', fontSize: '11px' }}>A</kbd> and <kbd style={{ padding: '1px 4px', backgroundColor: '#333', borderRadius: '3px', fontSize: '11px' }}>D</kbd> keys to move
            </div>
            <div style={{ marginBottom: '6px' }}>
              <strong>Player 2 (Bottom):</strong> Use <kbd style={{ padding: '1px 4px', backgroundColor: '#333', borderRadius: '3px', fontSize: '11px' }}>←</kbd> and <kbd style={{ padding: '1px 4px', backgroundColor: '#333', borderRadius: '3px', fontSize: '11px' }}>→</kbd> arrow keys to move
            </div>
            <div style={{ marginTop: '8px', color: GAME_CONFIG.COLORS.BALL, fontSize: '11px' }}>
              <strong>Note:</strong> Play against an opponent online! Create or join a room to start.
            </div>
          </>
        ) : null}
        <div style={{ marginBottom: '6px' }}>
          <strong>Pause:</strong> Press <kbd style={{ padding: '1px 4px', backgroundColor: '#333', borderRadius: '3px', fontSize: '11px' }}>Space</kbd> or <kbd style={{ padding: '1px 4px', backgroundColor: '#333', borderRadius: '3px', fontSize: '11px' }}>Esc</kbd>
        </div>
        {/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768 ? (
          <div style={{ marginTop: '8px', marginBottom: '6px', color: GAME_CONFIG.COLORS.BALL, fontSize: '11px' }}>
            <strong>Mobile:</strong> Use the on-screen arrow buttons to control your paddle!
          </div>
        ) : null}
        <div style={{ marginTop: '8px', marginBottom: '6px', color: GAME_CONFIG.COLORS.BALL, fontSize: '11px' }}>
          <strong>Goal:</strong> Hit the ball to score on the opposite side. First to {GAME_CONFIG.WIN_SCORE} wins!
        </div>
        <div style={{ marginTop: '8px', color: GAME_CONFIG.COLORS.OBSTACLE, fontSize: '11px' }}>
          <strong>Watch out:</strong> Holes will reset the ball, poles will reflect it!
        </div>
      </div>
    </div>
  );
};

export default Instructions;

