import React from 'react';
import { GAME_CONFIG } from '../config/gameConfig';

const Ball = ({ x, y, size }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: GAME_CONFIG.COLORS.BALL,
        boxShadow: `0 0 10px ${GAME_CONFIG.COLORS.BALL}`,
        transition: 'none'
      }}
    />
  );
};

export default Ball;

