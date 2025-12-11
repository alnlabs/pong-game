import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import GameBoard from '../components/GameBoard';
import ScoreBoard from '../components/ScoreBoard';
import GameOver from '../components/GameOver';
import OnlineLobby from '../components/OnlineLobby';
import Auth from '../components/Auth';
import firebaseAuth from '../utils/firebaseAuth';
import { GAME_CONFIG } from '../config/gameConfig';
import { recordGameResult } from '../utils/leaderboard';
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

  const handleScoreUpdate = (newScore1, newScore2) => {
    setScore1(newScore1);
    setScore2(newScore2);
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

  const handleGameOver = (winningPlayer) => {
    setGameOver(true);
    setWinner(winningPlayer);
    
    // Record game results to leaderboard
    const playerNames = getPlayerNames();
    const finalScore1 = score1;
    const finalScore2 = score2;
    
    if (winningPlayer === 1) {
      // Player 1 won
      recordGameResult(
        playerNames.player1,
        true,
        finalScore1,
        playerNames.player2,
        gameMode
      );
      recordGameResult(
        playerNames.player2,
        false,
        finalScore2,
        playerNames.player1,
        gameMode
      );
    } else if (winningPlayer === 2) {
      // Player 2 won
      recordGameResult(
        playerNames.player2,
        true,
        finalScore2,
        playerNames.player1,
        gameMode
      );
      recordGameResult(
        playerNames.player1,
        false,
        finalScore1,
        playerNames.player2,
        gameMode
      );
    }
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
    setShowOnlineLobby(false);
    setOnlineConfig(null);
    // Navigate back to home to allow mode selection
    navigate('/');
  };

  const handleOnlineGameStart = (config) => {
    setOnlineConfig(config);
    setShowOnlineLobby(false);
    handleRestart();
  };

  const handleOnlineCancel = () => {
    setShowOnlineLobby(false);
    setOnlineConfig(null);
    // Navigate back to home to allow mode selection
    navigate('/');
  };

  const handleDifficultyChange = (difficulty) => {
    setAiDifficulty(difficulty);
    if (gameMode === 'ai') {
      handleRestart();
    }
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
      <div className="game-container" style={{ height: '100%', overflow: 'hidden' }}>
        {/* Minimal header - only show Home button */}
        <div style={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'flex-end',
          marginBottom: '6px',
          padding: '0 10px',
          boxSizing: 'border-box',
          flexShrink: 0
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '5px 10px',
              fontSize: '11px',
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
            <ScoreBoard 
              score1={score1} 
              score2={score2}
              player1Name={playerNames.player1}
              player2Name={playerNames.player2}
            />
            
            {/* Mode selector button for AI mode */}
            {gameMode === 'ai' && (
              <button
                onClick={() => navigate('/')}
                style={{
                  width: '100%',
                  padding: '6px',
                  marginBottom: '6px',
                  fontSize: '11px',
                  backgroundColor: 'rgba(22, 33, 62, 0.6)',
                  color: GAME_CONFIG.COLORS.TEXT,
                  border: `1px solid ${GAME_CONFIG.COLORS.OBSTACLE}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  opacity: 0.7,
                  touchAction: 'manipulation'
                }}
              >
                Change Game Mode
              </button>
            )}
            
            {showOnlineLobby && user && (
              <OnlineLobby
                onGameStart={handleOnlineGameStart}
                onCancel={handleOnlineCancel}
              />
            )}
            
            {!showOnlineLobby && (
              <div style={{ 
                width: '100%', 
                display: 'flex', 
                justifyContent: 'center',
                flexShrink: 1,
                minHeight: 0,
                overflow: 'hidden'
              }}>
                <GameBoard
                  key={gameKey}
                  gameMode={gameMode}
                  aiDifficulty={aiDifficulty}
                  onlineConfig={onlineConfig}
                  onScoreUpdate={handleScoreUpdate}
                  onGameOver={handleGameOver}
                  player1Name={playerNames.player1}
                  player2Name={playerNames.player2}
                />
                {gameOver && <GameOver winner={winner} onRestart={handleRestart} gameMode={gameMode} />}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Game;
