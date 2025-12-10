import React from 'react';
import { GAME_CONFIG } from '../config/gameConfig';

const Hole = ({ x, y, radius }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: x - radius,
        top: y - radius,
        width: radius * 2,
        height: radius * 2,
        borderRadius: '50%',
        backgroundColor: GAME_CONFIG.COLORS.BACKGROUND,
        border: `3px dashed ${GAME_CONFIG.COLORS.OBSTACLE}`,
        boxShadow: `inset 0 0 20px ${GAME_CONFIG.COLORS.OBSTACLE}`
      }}
    />
  );
};

const Pole = ({ x, y, width, height }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: x - width / 2,
        top: y - height / 2,
        width: width,
        height: height,
        backgroundColor: GAME_CONFIG.COLORS.OBSTACLE,
        borderRadius: '5px',
        boxShadow: `0 0 10px ${GAME_CONFIG.COLORS.OBSTACLE}`,
        border: `2px solid ${GAME_CONFIG.COLORS.BALL}`
      }}
    />
  );
};

const Obstacles = ({ obstacles = [] }) => {
  if (!GAME_CONFIG.OBSTACLES_ENABLED || !obstacles.length) {
    return null;
  }

  return (
    <>
      {obstacles.map((obstacle, index) => {
        if (obstacle.type === 'hole') {
          return (
            <Hole
              key={`hole-${index}`}
              x={obstacle.x}
              y={obstacle.y}
              radius={obstacle.radius || GAME_CONFIG.HOLE_RADIUS}
            />
          );
        } else if (obstacle.type === 'pole') {
          return (
            <Pole
              key={`pole-${index}`}
              x={obstacle.x}
              y={obstacle.y}
              width={obstacle.width || GAME_CONFIG.POLE_WIDTH}
              height={obstacle.height || GAME_CONFIG.POLE_HEIGHT}
            />
          );
        }
        return null;
      })}
    </>
  );
};

export default Obstacles;

