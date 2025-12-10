import React from 'react';
import { GAME_CONFIG } from '../config/gameConfig';

const Instructions = ({ gameMode = '2player' }) => {
  return (
    <div
      style={{
        width: GAME_CONFIG.CANVAS_WIDTH,
        padding: '20px',
        color: GAME_CONFIG.COLORS.TEXT,
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: GAME_CONFIG.COLORS.BACKGROUND,
        borderRadius: '10px',
        marginTop: '20px',
        opacity: 0.9
      }}
    >
      <div style={{ marginBottom: '15px', fontSize: '18px', fontWeight: 'bold' }}>
        How to Play:
      </div>
      <div style={{ lineHeight: '1.8' }}>
        {gameMode === '2player' ? (
          <>
            <div><strong>Player 1 (Top):</strong> Use <kbd style={{ padding: '2px 6px', backgroundColor: '#333', borderRadius: '3px' }}>A</kbd> and <kbd style={{ padding: '2px 6px', backgroundColor: '#333', borderRadius: '3px' }}>D</kbd> keys to move</div>
            <div><strong>Player 2 (Bottom):</strong> Use <kbd style={{ padding: '2px 6px', backgroundColor: '#333', borderRadius: '3px' }}>←</kbd> and <kbd style={{ padding: '2px 6px', backgroundColor: '#333', borderRadius: '3px' }}>→</kbd> arrow keys to move</div>
          </>
        ) : gameMode === 'ai' ? (
          <div><strong>You (Bottom):</strong> Use <kbd style={{ padding: '2px 6px', backgroundColor: '#333', borderRadius: '3px' }}>←</kbd> and <kbd style={{ padding: '2px 6px', backgroundColor: '#333', borderRadius: '3px' }}>→</kbd> arrow keys to move. The AI controls the top paddle.</div>
        ) : gameMode === 'online' ? (
          <>
            <div><strong>Player 1 (Top):</strong> Use <kbd style={{ padding: '2px 6px', backgroundColor: '#333', borderRadius: '3px' }}>A</kbd> and <kbd style={{ padding: '2px 6px', backgroundColor: '#333', borderRadius: '3px' }}>D</kbd> keys to move</div>
            <div><strong>Player 2 (Bottom):</strong> Use <kbd style={{ padding: '2px 6px', backgroundColor: '#333', borderRadius: '3px' }}>←</kbd> and <kbd style={{ padding: '2px 6px', backgroundColor: '#333', borderRadius: '3px' }}>→</kbd> arrow keys to move</div>
            <div style={{ marginTop: '10px', color: GAME_CONFIG.COLORS.BALL, fontSize: '12px' }}>
              <strong>Note:</strong> Play against an opponent online! Create or join a room to start.
            </div>
          </>
        ) : null}
        <div><strong>Pause:</strong> Press <kbd style={{ padding: '2px 6px', backgroundColor: '#333', borderRadius: '3px' }}>Space</kbd> or <kbd style={{ padding: '2px 6px', backgroundColor: '#333', borderRadius: '3px' }}>Esc</kbd></div>
        {/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768 ? (
          <div style={{ marginTop: '10px', color: GAME_CONFIG.COLORS.BALL, fontSize: '12px' }}>
            <strong>Mobile:</strong> Use the on-screen arrow buttons to control your paddle!
          </div>
        ) : null}
        <div style={{ marginTop: '10px', color: GAME_CONFIG.COLORS.BALL }}>
          <strong>Goal:</strong> Hit the ball to score on the opposite side. First to {GAME_CONFIG.WIN_SCORE} wins!
        </div>
        <div style={{ marginTop: '10px', color: GAME_CONFIG.COLORS.OBSTACLE }}>
          <strong>Watch out:</strong> Holes will reset the ball, poles will reflect it!
        </div>
      </div>
    </div>
  );
};

export default Instructions;

