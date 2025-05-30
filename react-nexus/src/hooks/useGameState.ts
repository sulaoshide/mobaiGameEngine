import { useState, useCallback } from 'react';
import { GameState, Scene, Sprite } from '../types';

const initialState: GameState = {
  currentScene: {
    id: 'default',
    name: '默认场景',
    sprites: [],
    background: '#ffffff'
  },
  scenes: [],
  selectedSprite: null
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(initialState);

  const addSprite = useCallback((sprite: Sprite) => {
    setGameState(prev => ({
      ...prev,
      currentScene: {
        ...prev.currentScene,
        sprites: [...prev.currentScene.sprites, sprite]
      }
    }));
  }, []);

  const updateSprite = useCallback((spriteId: string, updates: Partial<Sprite>) => {
    setGameState(prev => ({
      ...prev,
      currentScene: {
        ...prev.currentScene,
        sprites: prev.currentScene.sprites.map(sprite =>
          sprite.id === spriteId ? { ...sprite, ...updates } : sprite
        )
      }
    }));
  }, []);

  const selectSprite = useCallback((sprite: Sprite | null) => {
    setGameState(prev => ({
      ...prev,
      selectedSprite: sprite
    }));
  }, []);

  return {
    gameState,
    addSprite,
    updateSprite,
    selectSprite
  };
}; 