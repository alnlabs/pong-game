import React from 'react';
import { GAME_CONFIG } from '../config/gameConfig';

const ScoreBoard = ({ score1, score2, player1Name = 'Player 1', player2Name = 'Player 2' }) => {
  const isMobile = window.innerWidth < 768;
  
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: isMobile ? '100%' : GAME_CONFIG.CANVAS_WIDTH,
        maxWidth: '100%',
        padding: isMobile ? '12px 10px' : '20px',
        color: GAME_CONFIG.COLORS.TEXT,
        fontSize: isMobile ? '18px' : '24px',
        fontWeight: 'bold',
        fontFamily: 'Arial, sans-serif',
        marginBottom: isMobile ? '8px' : '0'
      }}
    >
      <div style={{ textAlign: 'left', flex: 1 }}>
        <div style={{ fontSize: isMobile ? '12px' : '16px', opacity: 0.8, marginBottom: isMobile ? '4px' : '0' }}>
          {player1Name}
        </div>
        <div style={{ fontSize: isMobile ? '28px' : '36px', color: GAME_CONFIG.COLORS.BALL }}>
          {score1}
        </div>
      </div>
      <div style={{ textAlign: 'center', fontSize: isMobile ? '14px' : '18px', opacity: 0.6, flex: 0, padding: isMobile ? '0 8px' : '0 20px' }}>
        VS
      </div>
      <div style={{ textAlign: 'right', flex: 1 }}>
        <div style={{ fontSize: isMobile ? '12px' : '16px', opacity: 0.8, marginBottom: isMobile ? '4px' : '0' }}>
          {player2Name}
        </div>
        <div style={{ fontSize: isMobile ? '28px' : '36px', color: GAME_CONFIG.COLORS.BALL }}>
          {score2}
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;

