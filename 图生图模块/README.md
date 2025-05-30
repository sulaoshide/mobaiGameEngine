# AI画板原型项目（aihua）

## 结构

- frontend/  前端React项目，画板与AI图片显示
- backend/   后端Node.js，负责与AI模型API通信

## 快速开始

### 1. 安装依赖
分别进入frontend和backend目录，执行：

```
npm install
```

### 2. 启动后端
```
cd backend
node index.js
```

> 注意：需要在index.js中填写你的Replicate API Key。

### 3. 启动前端
```
cd frontend
npx serve -s .
```

### 4. 访问
浏览器打开 http://localhost:5000 或 http://localhost:3000

---

## 说明
- 前端画板支持鼠标绘制，点击"生成AI图片"后，右侧显示AI生成结果。
- 后端调用Replicate的Scribble Diffusion模型。
- 可根据需要扩展prompt输入、画板功能等。 