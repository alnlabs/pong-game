import React from 'react';
import { GAME_CONFIG } from '../config/gameConfig';

const ModeSelector = ({ gameMode, onModeChange, aiDifficulty, onDifficultyChange }) => {
  return (
    <div
      style={{
        width: GAME_CONFIG.CANVAS_WIDTH,
        padding: '20px',
        backgroundColor: GAME_CONFIG.COLORS.BACKGROUND,
        borderRadius: '10px',
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}
    >
      <div
        style={{
          color: GAME_CONFIG.COLORS.TEXT,
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '10px'
        }}
      >
        Game Mode:
      </div>
      
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={() => onModeChange('2player')}
          style={{
            flex: 1,
            minWidth: '120px',
            padding: '12px 20px',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: gameMode === '2player' 
              ? GAME_CONFIG.COLORS.BALL 
              : GAME_CONFIG.COLORS.OBSTACLE,
            color: GAME_CONFIG.COLORS.TEXT,
            border: `2px solid ${GAME_CONFIG.COLORS.BALL}`,
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: gameMode === '2player' 
              ? `0 0 15px ${GAME_CONFIG.COLORS.BALL}` 
              : 'none'
          }}
          onMouseEnter={(e) => {
            if (gameMode !== '2player') {
              e.target.style.backgroundColor = GAME_CONFIG.COLORS.OBSTACLE;
              e.target.style.transform = 'scale(1.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (gameMode !== '2player') {
              e.target.style.backgroundColor = GAME_CONFIG.COLORS.OBSTACLE;
              e.target.style.transform = 'scale(1)';
            }
          }}
        >
          2 Players
        </button>
        
        <button
          onClick={() => onModeChange('ai')}
          style={{
            flex: 1,
            minWidth: '120px',
            padding: '12px 20px',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: gameMode === 'ai' 
              ? GAME_CONFIG.COLORS.BALL 
              : GAME_CONFIG.COLORS.OBSTACLE,
            color: GAME_CONFIG.COLORS.TEXT,
            border: `2px solid ${GAME_CONFIG.COLORS.BALL}`,
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: gameMode === 'ai' 
              ? `0 0 15px ${GAME_CONFIG.COLORS.BALL}` 
              : 'none'
          }}
          onMouseEnter={(e) => {
            if (gameMode !== 'ai') {
              e.target.style.backgroundColor = GAME_CONFIG.COLORS.OBSTACLE;
              e.target.style.transform = 'scale(1.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (gameMode !== 'ai') {
              e.target.style.backgroundColor = GAME_CONFIG.COLORS.OBSTACLE;
              e.target.style.transform = 'scale(1)';
            }
          }}
        >
          vs AI
        </button>

        <button
          onClick={() => onModeChange('online')}
          style={{
            flex: 1,
            minWidth: '120px',
            padding: '12px 20px',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: gameMode === 'online' 
              ? GAME_CONFIG.COLORS.BALL 
              : GAME_CONFIG.COLORS.OBSTACLE,
            color: GAME_CONFIG.COLORS.TEXT,
            border: `2px solid ${GAME_CONFIG.COLORS.BALL}`,
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: gameMode === 'online' 
              ? `0 0 15px ${GAME_CONFIG.COLORS.BALL}` 
              : 'none'
          }}
          onMouseEnter={(e) => {
            if (gameMode !== 'online') {
              e.target.style.backgroundColor = GAME_CONFIG.COLORS.OBSTACLE;
              e.target.style.transform = 'scale(1.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (gameMode !== 'online') {
              e.target.style.backgroundColor = GAME_CONFIG.COLORS.OBSTACLE;
              e.target.style.transform = 'scale(1)';
            }
          }}
        >
          Online
        </button>
      </div>

      {gameMode === 'ai' && (
        <div
          style={{
            marginTop: '10px',
            padding: '15px',
            backgroundColor: GAME_CONFIG.COLORS.OBSTACLE,
            borderRadius: '8px'
          }}
        >
          <div
            style={{
              color: GAME_CONFIG.COLORS.TEXT,
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '10px'
            }}
          >
            AI Difficulty:
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['easy', 'medium', 'hard'].map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => onDifficultyChange(difficulty)}
                style={{
                  flex: 1,
                  padding: '10px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  backgroundColor: aiDifficulty === difficulty
                    ? GAME_CONFIG.COLORS.BALL
                    : 'transparent',
                  color: GAME_CONFIG.COLORS.TEXT,
                  border: `2px solid ${GAME_CONFIG.COLORS.BALL}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (aiDifficulty !== difficulty) {
                    e.target.style.backgroundColor = GAME_CONFIG.COLORS.OBSTACLE;
                  }
                }}
                onMouseLeave={(e) => {
                  if (aiDifficulty !== difficulty) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeSelector;

