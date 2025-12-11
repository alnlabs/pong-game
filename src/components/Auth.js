import React, { useState, useEffect } from 'react';
import firebaseAuth from '../utils/firebaseAuth';
import { GAME_CONFIG } from '../config/gameConfig';

const Auth = ({ onAuthSuccess, onCancel }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize auth state listener
    firebaseAuth.init();

    // Check if user is already authenticated
    const unsubscribe = firebaseAuth.onAuthStateChange((user) => {
      if (user) {
        onAuthSuccess(user);
      }
    });

    // Try anonymous sign-in first
    const tryAnonymousSignIn = async () => {
      const result = await firebaseAuth.signInAnonymously();
      if (result.success) {
        onAuthSuccess(result.user);
      }
    };

    tryAnonymousSignIn();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [onAuthSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (isSignUp) {
        result = await firebaseAuth.createAccount(email, password, displayName);
      } else {
        result = await firebaseAuth.signInWithEmail(email, password);
      }

      if (result.success) {
        onAuthSuccess(result.user);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    setLoading(true);
    setError('');
    const result = await firebaseAuth.signInAnonymously();
    if (result.success) {
      onAuthSuccess(result.user);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: GAME_CONFIG.CANVAS_WIDTH,
        margin: '20px auto',
        backgroundColor: GAME_CONFIG.COLORS.BACKGROUND,
        padding: '30px',
        borderRadius: '20px',
        border: `3px solid ${GAME_CONFIG.COLORS.BALL}`,
        boxShadow: `0 0 30px ${GAME_CONFIG.COLORS.BALL}`
      }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          {onCancel && (
            <button
              onClick={onCancel}
              style={{
                background: 'none',
                border: `1px solid ${GAME_CONFIG.COLORS.TEXT}`,
                color: GAME_CONFIG.COLORS.TEXT,
                cursor: 'pointer',
                fontSize: '14px',
                padding: '8px 16px',
                borderRadius: '8px',
                opacity: 0.8,
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '1'}
              onMouseLeave={(e) => e.target.style.opacity = '0.8'}
            >
              ← Back
            </button>
          )}
          <h2
            style={{
              color: GAME_CONFIG.COLORS.TEXT,
              textAlign: 'center',
              fontSize: '28px',
              margin: 0,
              flex: 1
            }}
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h2>
          {onCancel && <div style={{ width: '100px' }}></div>}
        </div>

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div style={{ marginBottom: '15px' }}>
              <label
                style={{
                  display: 'block',
                  color: GAME_CONFIG.COLORS.TEXT,
                  marginBottom: '5px',
                  fontSize: '14px'
                }}
              >
                Display Name (optional):
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: `2px solid ${GAME_CONFIG.COLORS.OBSTACLE}`,
                  backgroundColor: GAME_CONFIG.COLORS.OBSTACLE,
                  color: GAME_CONFIG.COLORS.TEXT,
                  fontSize: '14px'
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: '15px' }}>
            <label
              style={{
                display: 'block',
                color: GAME_CONFIG.COLORS.TEXT,
                marginBottom: '5px',
                fontSize: '14px'
              }}
            >
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: `2px solid ${GAME_CONFIG.COLORS.OBSTACLE}`,
                backgroundColor: GAME_CONFIG.COLORS.OBSTACLE,
                color: GAME_CONFIG.COLORS.TEXT,
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                color: GAME_CONFIG.COLORS.TEXT,
                marginBottom: '5px',
                fontSize: '14px'
              }}
            >
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: `2px solid ${GAME_CONFIG.COLORS.OBSTACLE}`,
                backgroundColor: GAME_CONFIG.COLORS.OBSTACLE,
                color: GAME_CONFIG.COLORS.TEXT,
                fontSize: '14px'
              }}
            />
          </div>

          {error && (
            <div
              style={{
                padding: '10px',
                marginBottom: '15px',
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

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              backgroundColor: GAME_CONFIG.COLORS.BALL,
              color: GAME_CONFIG.COLORS.TEXT,
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              marginBottom: '10px'
            }}
          >
            {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            style={{
              background: 'none',
              border: 'none',
              color: GAME_CONFIG.COLORS.TEXT,
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '14px'
            }}
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>

        <div
          style={{
            borderTop: `1px solid ${GAME_CONFIG.COLORS.OBSTACLE}`,
            paddingTop: '15px',
            textAlign: 'center'
          }}
        >
          <button
            onClick={handleGuestSignIn}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              backgroundColor: 'transparent',
              color: GAME_CONFIG.COLORS.TEXT,
              border: `2px solid ${GAME_CONFIG.COLORS.BALL}`,
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            Continue as Guest
          </button>
        </div>
    </div>
  );
};

export default Auth;

