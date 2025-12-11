import React, { useState } from 'react';
import { GAME_CONFIG } from '../config/gameConfig';
import './GameModeModal.css';

const GameModeModal = ({ onClose, onSelectMode }) => {
  const [selectedMode, setSelectedMode] = useState(null);
  const [aiDifficulty, setAiDifficulty] = useState('medium');

  const handleModeClick = (mode) => {
    if (mode === 'ai') {
      setSelectedMode('ai');
    } else {
      // For non-AI modes, navigate immediately
      onSelectMode(mode);
    }
  };

  const handleAISelect = () => {
    onSelectMode(`ai?difficulty=${aiDifficulty}`);
  };

  const handleBack = () => {
    setSelectedMode(null);
  };

  if (selectedMode === 'ai') {
    return (
      <div className="game-mode-modal-overlay" onClick={onClose}>
        <div className="game-mode-modal" onClick={(e) => e.stopPropagation()}>
          <div className="game-mode-modal-header">
            <button className="game-mode-modal-back" onClick={handleBack}>
              ←
            </button>
            <h2 className="game-mode-modal-title">Select AI Difficulty</h2>
            <button className="game-mode-modal-close" onClick={onClose}>
              ✕
            </button>
          </div>
          
          <div className="ai-difficulty-options">
            <button
              className={`ai-difficulty-option ${aiDifficulty === 'easy' ? 'selected' : ''}`}
              onClick={() => setAiDifficulty('easy')}
            >
              <div className="difficulty-icon">😊</div>
              <div className="difficulty-name">Easy</div>
              <div className="difficulty-desc">Beginner friendly</div>
            </button>
            
            <button
              className={`ai-difficulty-option ${aiDifficulty === 'medium' ? 'selected' : ''}`}
              onClick={() => setAiDifficulty('medium')}
            >
              <div className="difficulty-icon">😐</div>
              <div className="difficulty-name">Medium</div>
              <div className="difficulty-desc">Balanced challenge</div>
            </button>
            
            <button
              className={`ai-difficulty-option ${aiDifficulty === 'hard' ? 'selected' : ''}`}
              onClick={() => setAiDifficulty('hard')}
            >
              <div className="difficulty-icon">😤</div>
              <div className="difficulty-name">Hard</div>
              <div className="difficulty-desc">Expert level</div>
            </button>
          </div>

          <button
            className="game-mode-confirm-button"
            onClick={handleAISelect}
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

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
            onClick={() => handleModeClick('2player')}
          >
            <div className="game-mode-icon">👥</div>
            <div className="game-mode-name">2 Players</div>
            <div className="game-mode-desc">Play with a friend locally</div>
          </button>
          
          <button
            className="game-mode-option"
            onClick={() => handleModeClick('ai')}
          >
            <div className="game-mode-icon">🤖</div>
            <div className="game-mode-name">vs AI</div>
            <div className="game-mode-desc">Challenge the computer</div>
          </button>
          
          <button
            className="game-mode-option"
            onClick={() => handleModeClick('online')}
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
