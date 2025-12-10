import React from 'react';
import { GAME_CONFIG } from '../config/gameConfig';

const Paddle = ({ x, y, width, height, isTop, isAI = false }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: width,
        height: height,
        backgroundColor: isAI ? '#533483' : GAME_CONFIG.COLORS.PADDLE,
        borderRadius: '8px',
        boxShadow: isAI 
          ? `0 0 20px #533483, inset 0 0 10px rgba(83, 52, 131, 0.5)` 
          : `0 0 15px ${GAME_CONFIG.COLORS.PADDLE}`,
        border: `2px solid ${GAME_CONFIG.COLORS.BALL}`
      }}
    >
      {isAI && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: GAME_CONFIG.COLORS.TEXT,
            fontSize: '10px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            opacity: 0.8
          }}
        >
          AI
        </div>
      )}
    </div>
  );
};

export default Paddle;

