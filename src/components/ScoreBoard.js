import React from 'react';
import { GAME_CONFIG } from '../config/gameConfig';

const ScoreBoard = ({ score1, score2, player1Name = 'Player 1', player2Name = 'Player 2' }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: GAME_CONFIG.CANVAS_WIDTH,
        padding: '20px',
        color: GAME_CONFIG.COLORS.TEXT,
        fontSize: '24px',
        fontWeight: 'bold',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <div style={{ textAlign: 'left' }}>
        <div style={{ fontSize: '16px', opacity: 0.8 }}>{player1Name}</div>
        <div style={{ fontSize: '36px', color: GAME_CONFIG.COLORS.BALL }}>
          {score1}
        </div>
      </div>
      <div style={{ textAlign: 'center', fontSize: '18px', opacity: 0.6 }}>
        VS
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '16px', opacity: 0.8 }}>{player2Name}</div>
        <div style={{ fontSize: '36px', color: GAME_CONFIG.COLORS.BALL }}>
          {score2}
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;

