// gameLoop.js
// 2D游戏主循环与渲染逻辑（参考Kontra.js等开源引擎设计）

let lastTime = 0;
let running = false;
let gameObjects = [];

// 注册游戏对象（需实现update和render方法）
export function addGameObject(obj) {
  gameObjects.push(obj);
}

// 移除游戏对象
export function removeGameObject(obj) {
  gameObjects = gameObjects.filter(o => o !== obj);
}

// 主循环
export function gameLoop(time = 0) {
  if (!running) return;
  const delta = (time - lastTime) / 1000; // 秒
  lastTime = time;

  // 1. 更新所有对象
  gameObjects.forEach(obj => obj.update && obj.update(delta));

  // 2. 渲染所有对象
  const ctx = getGameContext();
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  gameObjects.forEach(obj => obj.render && obj.render(ctx));

  requestAnimationFrame(gameLoop);
}

// 启动主循环
export function startGameLoop() {
  if (!running) {
    running = true;
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
  }
}

// 暂停主循环
export function stopGameLoop() {
  running = false;
}

// 获取Canvas 2D上下文（假设页面有id为game-canvas的canvas）
function getGameContext() {
  const canvas = document.getElementById('game-canvas');
  if (!canvas) throw new Error('未找到id为game-canvas的canvas元素');
  return canvas.getContext('2d');
}

// 示例：如何定义一个游戏对象
/*
const player = {
  x: 100, y: 100, vx: 50, vy: 0,
  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  },
  render(ctx) {
    ctx.fillStyle = 'blue';
    ctx.fillRect(this.x, this.y, 32, 32);
  }
};
addGameObject(player);
startGameLoop();
*/

// 挂载到window，确保全局可用
window.addGameObject = addGameObject;
window.removeGameObject = removeGameObject;
window.startGameLoop = startGameLoop;
window.stopGameLoop = stopGameLoop;

addGameObject({
  x: 100, y: 100, vx: 50, vy: 0,
  update(dt) { this.x += this.vx * dt; },
  render(ctx) { ctx.fillStyle = 'blue'; ctx.fillRect(this.x, this.y, 32, 32); }
}); 