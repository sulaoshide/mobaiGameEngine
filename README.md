# 墨白游戏引擎 · Web端编辑器

一个现代化、可扩展的网页端游戏引擎编辑器，支持AI资源生成、可视化场景编辑、精灵管理、属性调节等功能。

## 功能亮点

- 🖼️ AI图片生成（支持本地Stable Diffusion、OpenAI DALL·E等）
- 🗂️ 资源管理（场景、精灵、音效等分组管理）
- 🕹️ 游戏视口实时预览与拖拽
- 🎨 属性栏分组、色块调色板
- 🧩 层级/动画/控制台多标签切换
- 💡 交互友好、UI/UX细节优化

## 快速开始

1. 克隆项目
   ```bash
   git clone https://github.com/你的用户名/你的仓库名.git
   cd 你的仓库名
   ```

2. 安装依赖
   ```bash
   npm install
   ```

3. 启动开发环境
   ```bash
   npm start
   ```

4. 访问本地 [http://localhost:3000](http://localhost:3000)

## AI资源生成说明

- 支持本地Stable Diffusion（需本地API服务），或配置OpenAI、Stability等API Key
- 生成图片可一键添加到精灵资源区

## 目录结构

```
├── public/                # 静态资源
├── src/
│   ├── components/        # 主要UI组件
│   ├── context/           # 全局状态管理
│   ├── api/               # AI生成API接口
│   └── ...                # 其他模块
├── package.json
└── README.md
```

## 许可证

本项目基于 MIT License 开源，欢迎自由使用与二次开发。

---

> **墨白游戏引擎**  
> 让游戏创作更简单、更智能！ 