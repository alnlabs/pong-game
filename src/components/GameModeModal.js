import React from 'react';
import { GAME_CONFIG } from '../config/gameConfig';
import './GameModeModal.css';

const GameModeModal = ({ onClose, onSelectMode }) => {
  return (
    <div className="game-mode-modal-overlay" onClick={onClose}>
      <div className="game-mode-modal" onClick={(e) => e.stopPropagation()}>
        <div className="game-mode-modal-header">
          <h2 className="game-mode-modal-title">Select Game Mode</h2>
          <button className="game-mode-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="game-mode-options">
          <button
            className="game-mode-option"
            onClick={() => onSelectMode('2player')}
          >
            <div className="game-mode-icon">👥</div>
            <div className="game-mode-name">2 Players</div>
            <div className="game-mode-desc">Play with a friend locally</div>
          </button>
          
          <button
            className="game-mode-option"
            onClick={() => onSelectMode('ai')}
          >
            <div className="game-mode-icon">🤖</div>
            <div className="game-mode-name">vs AI</div>
            <div className="game-mode-desc">Challenge the computer</div>
          </button>
          
          <button
            className="game-mode-option"
            onClick={() => onSelectMode('online')}
          >
            <div className="game-mode-icon">🌐</div>
            <div className="game-mode-name">Online</div>
            <div className="game-mode-desc">Play against others online</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameModeModal;
