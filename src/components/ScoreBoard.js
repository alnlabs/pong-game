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
        padding: '6px 10px',
        color: GAME_CONFIG.COLORS.TEXT,
        fontSize: '14px',
        fontWeight: 'bold',
        fontFamily: 'Arial, sans-serif',
        marginBottom: '6px',
        boxSizing: 'border-box',
        flexShrink: 0
      }}
    >
      <div style={{ textAlign: 'left', flex: 1 }}>
        <div style={{ fontSize: '11px', opacity: 0.8, marginBottom: '2px' }}>
          {player1Name}
        </div>
        <div style={{ fontSize: '24px', color: GAME_CONFIG.COLORS.BALL, lineHeight: '1' }}>
          {score1}
        </div>
      </div>
      <div style={{ textAlign: 'center', fontSize: '12px', opacity: 0.6, flex: 0, padding: '0 8px' }}>
        VS
      </div>
      <div style={{ textAlign: 'right', flex: 1 }}>
        <div style={{ fontSize: '11px', opacity: 0.8, marginBottom: '2px' }}>
          {player2Name}
        </div>
        <div style={{ fontSize: '24px', color: GAME_CONFIG.COLORS.BALL, lineHeight: '1' }}>
          {score2}
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;

