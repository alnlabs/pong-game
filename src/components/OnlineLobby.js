import React, { useState, useEffect } from 'react';
import firebaseMultiplayer from '../utils/firebaseMultiplayer';
import { GAME_CONFIG } from '../config/gameConfig';

const OnlineLobby = ({ onGameStart, onCancel }) => {
  const [roomId, setRoomId] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, creating, joining, waiting, ready, error
  const [error, setError] = useState('');
  const multiplayerManager = firebaseMultiplayer;

  useEffect(() => {
    // Set up event handlers
    multiplayerManager.on('Connect', () => {
      setStatus('connected');
    });

    multiplayerManager.on('Disconnect', () => {
      setStatus('disconnected');
    });

    multiplayerManager.on('RoomCreated', (data) => {
      setIsHost(true);
      setStatus('waiting');
      setError('');
    });

    multiplayerManager.on('RoomJoined', (data) => {
      setIsHost(false);
      setStatus('waiting');
      setError('');
    });

    multiplayerManager.on('GameReady', (data) => {
      setStatus('ready');
      setTimeout(() => {
        onGameStart({
          roomId: multiplayerManager.getRoomId(),
          playerNumber: multiplayerManager.getPlayerNumber(),
          isHost,
          multiplayerType: 'firebase'
        });
      }, 1000);
    });

    multiplayerManager.on('RoomError', (data) => {
      setError(data.message);
      setStatus('error');
    });

    multiplayerManager.on('OpponentDisconnected', () => {
      setError('Opponent disconnected');
      setStatus('error');
    });

    // Connect to Firebase
    multiplayerManager.connect();

    return () => {
      // Cleanup on unmount
      if (status === 'idle' || status === 'error') {
        multiplayerManager.disconnect();
      }
    };
  }, []);

  const handleCreateRoom = async () => {
    const newRoomId = roomId || generateRoomId();
    setRoomId(newRoomId);
    setStatus('creating');
    setError('');
    
    try {
      await multiplayerManager.createRoom(newRoomId);
    } catch (err) {
      setError(err.message || 'Failed to create room');
      setStatus('error');
    }
  };

  const handleJoinRoom = async () => {
    if (!roomId.trim()) {
      setError('Please enter a room ID');
      return;
    }

    setStatus('joining');
    setError('');
    
    try {
      await multiplayerManager.joinRoom(roomId);
    } catch (err) {
      setError(err.message || 'Failed to join room');
      setStatus('error');
    }
  };

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCancel = () => {
    multiplayerManager.disconnect();
    onCancel();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000
      }}
    >
      <div
        style={{
          backgroundColor: GAME_CONFIG.COLORS.BACKGROUND,
          padding: '25px 20px',
          borderRadius: '20px',
          border: `3px solid ${GAME_CONFIG.COLORS.BALL}`,
          boxShadow: `0 0 30px ${GAME_CONFIG.COLORS.BALL}`,
          minWidth: 'auto',
          maxWidth: '90%',
          width: '90%',
          boxSizing: 'border-box'
        }}
      >
        <h2
          style={{
            color: GAME_CONFIG.COLORS.TEXT,
            marginBottom: '20px',
            textAlign: 'center',
            fontSize: '22px'
          }}
        >
          Online Multiplayer
        </h2>


        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              display: 'block',
              color: GAME_CONFIG.COLORS.TEXT,
              marginBottom: '8px',
              fontSize: '14px'
            }}
          >
            Room ID:
          </label>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value.toUpperCase())}
            placeholder="Enter or generate room ID"
            disabled={status === 'waiting' || status === 'ready'}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: `2px solid ${GAME_CONFIG.COLORS.OBSTACLE}`,
              backgroundColor: GAME_CONFIG.COLORS.OBSTACLE,
              color: GAME_CONFIG.COLORS.TEXT,
              fontSize: '16px',
              textTransform: 'uppercase',
              textAlign: 'center',
              letterSpacing: '2px'
            }}
          />
        </div>

        {error && (
          <div
            style={{
              padding: '10px',
              marginBottom: '20px',
              backgroundColor: 'rgba(233, 69, 96, 0.2)',
              border: `1px solid ${GAME_CONFIG.COLORS.BALL}`,
              borderRadius: '8px',
              color: GAME_CONFIG.COLORS.BALL,
              textAlign: 'center',
              fontSize: '14px'
            }}
          >
            {error}
          </div>
        )}

        {status === 'waiting' && (
          <div
            style={{
              padding: '15px',
              marginBottom: '20px',
              backgroundColor: GAME_CONFIG.COLORS.OBSTACLE,
              borderRadius: '8px',
              color: GAME_CONFIG.COLORS.TEXT,
              textAlign: 'center',
              fontSize: '14px'
            }}
          >
            {isHost ? 'Waiting for opponent to join...' : 'Connected! Waiting for game to start...'}
            <div style={{ marginTop: '10px', fontSize: '12px', opacity: 0.7 }}>
              Room: <strong>{roomId}</strong>
            </div>
          </div>
        )}

        {status === 'ready' && (
          <div
            style={{
              padding: '15px',
              marginBottom: '20px',
              backgroundColor: GAME_CONFIG.COLORS.BALL,
              borderRadius: '8px',
              color: GAME_CONFIG.COLORS.TEXT,
              textAlign: 'center',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Game Starting...
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          {status === 'idle' && (
            <>
              <button
                onClick={handleCreateRoom}
                style={{
                  flex: 1,
                  padding: '12px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  backgroundColor: GAME_CONFIG.COLORS.BALL,
                  color: GAME_CONFIG.COLORS.TEXT,
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Create Room
              </button>
              <button
                onClick={handleJoinRoom}
                style={{
                  flex: 1,
                  padding: '12px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  backgroundColor: GAME_CONFIG.COLORS.OBSTACLE,
                  color: GAME_CONFIG.COLORS.TEXT,
                  border: `2px solid ${GAME_CONFIG.COLORS.BALL}`,
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Join Room
              </button>
            </>
          )}

          {(status === 'waiting' || status === 'error' || status === 'ready') && (
            <button
              onClick={handleCancel}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                fontWeight: 'bold',
                backgroundColor: GAME_CONFIG.COLORS.OBSTACLE,
                color: GAME_CONFIG.COLORS.TEXT,
                border: `2px solid ${GAME_CONFIG.COLORS.BALL}`,
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnlineLobby;

