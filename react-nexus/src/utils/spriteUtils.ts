import { Sprite } from '../types';

export const generateSpriteId = (): string => {
  return `sprite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const createDefaultSprite = (x: number, y: number): Sprite => {
  return {
    id: generateSpriteId(),
    x,
    y,
    width: 100,
    height: 100,
    type: 'default',
    properties: {}
  };
};

export const isPointInSprite = (x: number, y: number, sprite: Sprite): boolean => {
  return (
    x >= sprite.x &&
    x <= sprite.x + sprite.width &&
    y >= sprite.y &&
    y <= sprite.y + sprite.height
  );
};

export const calculateSpriteCenter = (sprite: Sprite): { x: number; y: number } => {
  return {
    x: sprite.x + sprite.width / 2,
    y: sprite.y + sprite.height / 2
  };
}; 