import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import GameBoard from '../components/GameBoard';
import ScoreBoard from '../components/ScoreBoard';
import GameOver from '../components/GameOver';
import Instructions from '../components/Instructions';
import ModeSelector from '../components/ModeSelector';
import OnlineLobby from '../components/OnlineLobby';
import Auth from '../components/Auth';
import firebaseAuth from '../utils/firebaseAuth';
import { GAME_CONFIG } from '../config/gameConfig';
import '../App.css';

const Game = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') || '2player';
  
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [gameKey, setGameKey] = useState(0);
  const [gameMode, setGameMode] = useState(initialMode);
  const [aiDifficulty, setAiDifficulty] = useState('medium');
  const [showOnlineLobby, setShowOnlineLobby] = useState(false);
  const [onlineConfig, setOnlineConfig] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showModeSelector, setShowModeSelector] = useState(true);

  const handleScoreUpdate = (newScore1, newScore2) => {
    setScore1(newScore1);
    setScore2(newScore2);
  };

  const handleGameOver = (winningPlayer) => {
    setGameOver(true);
    setWinner(winningPlayer);
  };

  const handleRestart = () => {
    setScore1(0);
    setScore2(0);
    setGameOver(false);
    setWinner(null);
    setGameKey(prev => prev + 1);
  };

  useEffect(() => {
    firebaseAuth.init();
    const unsubscribe = firebaseAuth.onAuthStateChange((user) => {
      setUser(user);
      setAuthLoading(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    setAuthLoading(false);
  };

  const handleModeChange = (mode) => {
    setGameMode(mode);
    handleRestart();
    
    if (mode === 'online') {
      if (!user) {
        return;
      }
      setShowOnlineLobby(true);
      setOnlineConfig(null);
    } else {
      setShowOnlineLobby(false);
      setOnlineConfig(null);
    }
  };

  const handleAuthCancel = () => {
    setGameMode('2player');
    setShowOnlineLobby(false);
    setOnlineConfig(null);
  };

  const handleOnlineGameStart = (config) => {
    setOnlineConfig(config);
    setShowOnlineLobby(false);
    handleRestart();
  };

  const handleOnlineCancel = () => {
    setShowOnlineLobby(false);
    setGameMode('2player');
    setOnlineConfig(null);
  };

  const handleDifficultyChange = (difficulty) => {
    setAiDifficulty(difficulty);
    if (gameMode === 'ai') {
      handleRestart();
    }
  };

  const getPlayerNames = () => {
    if (gameMode === 'ai') {
      return {
        player1: 'AI',
        player2: 'You'
      };
    }
    if (gameMode === 'online' && onlineConfig) {
      return {
        player1: onlineConfig.playerNumber === 1 ? 'You' : 'Opponent',
        player2: onlineConfig.playerNumber === 2 ? 'You' : 'Opponent'
      };
    }
    return {
      player1: 'Player 1',
      player2: 'Player 2'
    };
  };

  const playerNames = getPlayerNames();
  const showAuth = (gameMode === 'online' && !user && !authLoading);

  if (authLoading) {
    return (
      <div className="App">
        <div className="game-container">
          <h1 className="game-title">PONG GAME</h1>
          <div style={{ color: GAME_CONFIG.COLORS.TEXT, textAlign: 'center', padding: '40px' }}>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="game-container">
        {/* Minimal header - only show Home button */}
        <div style={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'flex-end',
          marginBottom: '8px',
          padding: '0 10px',
          boxSizing: 'border-box'
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              backgroundColor: 'rgba(22, 33, 62, 0.8)',
              color: GAME_CONFIG.COLORS.TEXT,
              border: `2px solid ${GAME_CONFIG.COLORS.BALL}`,
              borderRadius: '6px',
              cursor: 'pointer',
              touchAction: 'manipulation'
            }}
          >
            Home
          </button>
        </div>
        
        {showAuth && <Auth onAuthSuccess={handleAuthSuccess} onCancel={handleAuthCancel} />}
        
        {!showAuth && (
          <>
            {/* Mode selector - only show when toggled or before game starts */}
            {showModeSelector && (
              <div style={{ marginBottom: '8px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '5px',
                  padding: '0 5px'
                }}>
                  <span style={{ fontSize: '12px', color: GAME_CONFIG.COLORS.TEXT, opacity: 0.8 }}>
                    Game Mode
                  </span>
                  <button
                    onClick={() => setShowModeSelector(false)}
                    style={{
                      padding: '2px 8px',
                      fontSize: '10px',
                      backgroundColor: 'transparent',
                      color: GAME_CONFIG.COLORS.TEXT,
                      border: `1px solid ${GAME_CONFIG.COLORS.TEXT}`,
                      borderRadius: '4px',
                      cursor: 'pointer',
                      opacity: 0.6
                    }}
                  >
                    Hide
                  </button>
                </div>
                <ModeSelector
                  gameMode={gameMode}
                  onModeChange={handleModeChange}
                  aiDifficulty={aiDifficulty}
                  onDifficultyChange={handleDifficultyChange}
                />
              </div>
            )}
            {!showModeSelector && (
              <button
                onClick={() => setShowModeSelector(true)}
                style={{
                  width: '100%',
                  padding: '6px',
                  marginBottom: '8px',
                  fontSize: '11px',
                  backgroundColor: 'rgba(22, 33, 62, 0.6)',
                  color: GAME_CONFIG.COLORS.TEXT,
                  border: `1px solid ${GAME_CONFIG.COLORS.OBSTACLE}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  opacity: 0.7
                }}
              >
                Show Game Mode
              </button>
            )}
            
            <ScoreBoard 
              score1={score1} 
              score2={score2}
              player1Name={playerNames.player1}
              player2Name={playerNames.player2}
            />
            
            {showOnlineLobby && user && (
              <OnlineLobby
                onGameStart={handleOnlineGameStart}
                onCancel={handleOnlineCancel}
              />
            )}
            
            {!showOnlineLobby && (
              <>
                <GameBoard
                  key={gameKey}
                  gameMode={gameMode}
                  aiDifficulty={aiDifficulty}
                  onlineConfig={onlineConfig}
                  onScoreUpdate={handleScoreUpdate}
                  onGameOver={handleGameOver}
                />
                {gameOver && <GameOver winner={winner} onRestart={handleRestart} gameMode={gameMode} />}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Game;
