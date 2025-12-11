import React, { useState, useEffect } from 'react';
import firebaseAuth from '../utils/firebaseAuth';
import { GAME_CONFIG } from '../config/gameConfig';

const Auth = ({ onAuthSuccess, onCancel }) => {
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

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [onAuthSuccess]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await firebaseAuth.signInWithGoogle();
      if (result.success) {
        onAuthSuccess(result.user);
      } else {
        setError(result.error || 'Failed to sign in with Google');
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
        maxWidth: '100%',
        margin: '10px auto',
        backgroundColor: GAME_CONFIG.COLORS.BACKGROUND,
        padding: '20px 15px',
        borderRadius: '20px',
        border: `3px solid ${GAME_CONFIG.COLORS.BALL}`,
        boxShadow: `0 0 30px ${GAME_CONFIG.COLORS.BALL}`,
        boxSizing: 'border-box'
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
                transition: 'opacity 0.2s',
                touchAction: 'manipulation'
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
              fontSize: '22px',
              margin: 0,
              flex: 1
            }}
          >
            Sign In to Play Online
          </h2>
          {onCancel && <div style={{ width: '100px' }}></div>}
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

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: '#ffffff',
            color: '#333333',
            border: '2px solid #dadce0',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            transition: 'all 0.2s',
            touchAction: 'manipulation',
            boxShadow: loading ? 'none' : '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
              e.target.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              e.target.style.transform = 'translateY(0)';
            }
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>{loading ? 'Signing in...' : 'Continue with Google'}</span>
        </button>

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
              opacity: loading ? 0.6 : 1,
              transition: 'all 0.2s',
              touchAction: 'manipulation'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = 'rgba(233, 69, 96, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            Continue as Guest
          </button>
        </div>
    </div>
  );
};

export default Auth;

