export interface Sprite {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  properties: Record<string, any>;
}

export interface Scene {
  id: string;
  name: string;
  sprites: Sprite[];
  background: string;
}

export interface GameState {
  currentScene: Scene;
  scenes: Scene[];
  selectedSprite: Sprite | null;
}

export interface AIGeneratorConfig {
  prompt: string;
  style: string;
  size: {
    width: number;
    height: number;
  };
} 