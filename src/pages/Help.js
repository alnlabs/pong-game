import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GAME_CONFIG } from '../config/gameConfig';
import './Help.css';

const Help = () => {
  const navigate = useNavigate();

  return (
    <div className="help-page">
      <div className="help-container">
        <div className="help-header">
          <h1 className="help-title">How to Play</h1>
          <button 
            className="help-back-button"
            onClick={() => navigate('/')}
          >
            ← Home
          </button>
        </div>

        <div className="help-content">
          <section className="help-section">
            <h2 className="help-section-title">Basic Rules</h2>
            <div className="help-steps">
              <div className="help-step">
                <span className="help-step-number">1</span>
                <div className="help-step-content">
                  <strong>Objective:</strong> Score points by getting the ball past your opponent's goal line
                </div>
              </div>
              <div className="help-step">
                <span className="help-step-number">2</span>
                <div className="help-step-content">
                  <strong>Winning:</strong> First player to reach {GAME_CONFIG.WIN_SCORE} points wins the game
                </div>
              </div>
              <div className="help-step">
                <span className="help-step-number">3</span>
                <div className="help-step-content">
                  <strong>Ball Speed:</strong> The ball gradually increases speed every {GAME_CONFIG.SPEED_INCREASE_INTERVAL} hits
                </div>
              </div>
            </div>
          </section>

          <section className="help-section">
            <h2 className="help-section-title">Controls</h2>
            <div className="help-controls">
              <div className="help-control-item">
                <div className="help-control-label">Player 1 (Top Paddle)</div>
                <div className="help-control-keys">
                  <kbd>A</kbd> - Move Left
                  <kbd>D</kbd> - Move Right
                </div>
              </div>
              <div className="help-control-item">
                <div className="help-control-label">Player 2 (Bottom Paddle)</div>
                <div className="help-control-keys">
                  <kbd>←</kbd> - Move Left
                  <kbd>→</kbd> - Move Right
                </div>
              </div>
              <div className="help-control-item">
                <div className="help-control-label">Game Controls</div>
                <div className="help-control-keys">
                  <kbd>Space</kbd> or <kbd>Esc</kbd> - Pause/Resume
                </div>
              </div>
              <div className="help-control-item">
                <div className="help-control-label">Mobile Controls</div>
                <div className="help-control-keys">
                  Use on-screen arrow buttons to control your paddle
                </div>
              </div>
            </div>
          </section>

          <section className="help-section">
            <h2 className="help-section-title">Game Modes</h2>
            <div className="help-modes">
              <div className="help-mode">
                <h3 className="help-mode-title">2-Player Local</h3>
                <p className="help-mode-desc">
                  Play against a friend on the same device. Both players use keyboard or touch controls.
                </p>
              </div>
              <div className="help-mode">
                <h3 className="help-mode-title">vs AI</h3>
                <p className="help-mode-desc">
                  Challenge the computer! Choose from Easy, Medium, or Hard difficulty levels.
                </p>
              </div>
              <div className="help-mode">
                <h3 className="help-mode-title">Online Multiplayer</h3>
                <p className="help-mode-desc">
                  Play against other players online. Create or join a room to start playing.
                </p>
              </div>
            </div>
          </section>

          <section className="help-section">
            <h2 className="help-section-title">Obstacles</h2>
            <div className="help-obstacles">
              <div className="help-obstacle">
                <span className="help-obstacle-icon">🕳️</span>
                <div>
                  <strong>Holes:</strong> If the ball touches a hole, it resets to the center. Avoid them!
                </div>
              </div>
              <div className="help-obstacle">
                <span className="help-obstacle-icon">📊</span>
                <div>
                  <strong>Poles:</strong> These reflect the ball at different angles. Use them strategically!
                </div>
              </div>
            </div>
          </section>

          <section className="help-section">
            <h2 className="help-section-title">Tips & Strategies</h2>
            <div className="help-tips">
              <div className="help-tip">• Keep your paddle moving to react faster</div>
              <div className="help-tip">• Watch the ball's trajectory to predict where it will go</div>
              <div className="help-tip">• Use obstacles to your advantage - they can help or hurt</div>
              <div className="help-tip">• As speed increases, focus on positioning over speed</div>
              <div className="help-tip">• In online mode, maintain a stable connection for best experience</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Help;
