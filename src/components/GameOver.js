import React from 'react';
import { GAME_CONFIG } from '../config/gameConfig';

const GameOver = ({ winner, onRestart, gameMode = '2player' }) => {
  const getWinnerMessage = () => {
    if (gameMode === 'ai') {
      if (winner === 1) {
        return 'AI Wins!';
      } else {
        return 'You Win!';
      }
    }
    return `Player ${winner} Wins!`;
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: GAME_CONFIG.COLORS.TEXT,
        zIndex: 1000
      }}
    >
      <div
        style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: GAME_CONFIG.COLORS.BACKGROUND,
          borderRadius: '20px',
          border: `3px solid ${GAME_CONFIG.COLORS.BALL}`,
          boxShadow: `0 0 30px ${GAME_CONFIG.COLORS.BALL}`
        }}
      >
        <h1
          style={{
            fontSize: '48px',
            margin: '0 0 20px 0',
            color: GAME_CONFIG.COLORS.BALL
          }}
        >
          GAME OVER
        </h1>
        <p
          style={{
            fontSize: '32px',
            margin: '20px 0',
            color: GAME_CONFIG.COLORS.TEXT
          }}
        >
          {getWinnerMessage()}
        </p>
        <button
          onClick={onRestart}
          style={{
            marginTop: '30px',
            padding: '15px 40px',
            fontSize: '20px',
            fontWeight: 'bold',
            backgroundColor: GAME_CONFIG.COLORS.BALL,
            color: GAME_CONFIG.COLORS.TEXT,
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            boxShadow: `0 0 20px ${GAME_CONFIG.COLORS.BALL}`,
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
          }}
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameOver;

