import React from 'react';
import { GAME_CONFIG } from '../config/gameConfig';

const ScoreBoard = ({ score1, score2, player1Name = 'Player 1', player2Name = 'Player 2' }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        maxWidth: '100%',
        padding: '12px 10px',
        color: GAME_CONFIG.COLORS.TEXT,
        fontSize: '18px',
        fontWeight: 'bold',
        fontFamily: 'Arial, sans-serif',
        marginBottom: '8px',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ textAlign: 'left', flex: 1 }}>
        <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>
          {player1Name}
        </div>
        <div style={{ fontSize: '28px', color: GAME_CONFIG.COLORS.BALL }}>
          {score1}
        </div>
      </div>
      <div style={{ textAlign: 'center', fontSize: '14px', opacity: 0.6, flex: 0, padding: '0 8px' }}>
        VS
      </div>
      <div style={{ textAlign: 'right', flex: 1 }}>
        <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>
          {player2Name}
        </div>
        <div style={{ fontSize: '28px', color: GAME_CONFIG.COLORS.BALL }}>
          {score2}
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;

