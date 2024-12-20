# AI-Info-Collector 项目

## 项目简介

**AI-Info-Collector** 是一个基于 React 和 Flask 的全栈应用程序，主要功能是从特定网站收集并整理新闻、文章以及其他内容，提供更深入的分析和摘要。用户可以输入一个 URL，应用将对网页内容进行自动爬取、分析并展示结果，同时提供进一步的总结与细节查看功能。

前端使用了 React 和 React-Router，后端使用了 Flask 提供 API 接口服务，两者共同合作以便用户轻松地从各类网站中收集、分析和展示内容。

## 项目结构

该项目主要分为以下部分：

- **frontend**：前端部分，使用 React 开发，负责用户界面的展示和与后端 API 的交互。
- **backend**：后端部分，使用 Flask 开发，负责处理来自前端的请求，对目标网页进行爬取和信息处理。

## 环境要求

- **Node.js**（前端）
- **Python 3**（后端）
- **pipenv** 或 **virtualenv**（用于创建后端虚拟环境）

## 安装与运行步骤

### 1. 克隆仓库

首先，将代码仓库克隆到本地：

```bash
$ git clone https://github.com/Trista984/ai-info-collector.git
$ cd ai-info-collector
```

### 2. 前端设置

进入 `frontend` 目录，并安装依赖：

```bash
$ cd frontend
$ npm install
```

然后，启动前端开发服务器：

```bash
$ npm start
```

前端服务将会运行在 `http://localhost:3000`。

### 3. 后端设置

进入 `backend` 目录，创建虚拟环境并安装依赖：

```bash
$ cd ../backend
$ python3 -m venv .venv
$ source .venv/bin/activate
$ pip install -r requirements.txt
```

然后，启动后端服务：

```bash
$ python3 app.py
```

后端服务将会运行在 `http://127.0.0.1:5000`。

### 4. 使用 Bash 脚本自动启动前后端服务

为了简化启动前后端服务的流程，编写一个 Bash 脚本来自动启动虚拟环境并同时运行前后端服务。在项目根目录下创建一个名为 `start.sh` 的脚本文件

然后，可以通过以下命令同时启动前后端服务：

```bash
$ ./start.sh
```

### 5. 前后端联调

前端和后端在开发环境下需要同时运行。

- 前端服务运行在 `localhost:3000`
- 后端服务运行在 `localhost:5000`

前端通过 `fetch` 请求与后端进行交互，因此确保前后端服务均已启动后即可开始正常使用。

## 功能介绍

### 1. 网站新闻整理

用户可以在首页的搜索框中输入目标网站的 URL，点击“开始收集”，应用会自动对网站的内容进行抓取和处理，最后在页面中显示收集到的内容摘要。

### 2. 关键点和深度分析

用户可以在摘要信息中，点击“深入了解”按钮，查看该内容的详细总结、关键要点、深度分析以及引用案例等信息。

### 3. 快捷链接

首页提供了一些快捷链接按钮，用户可以一键访问与人工智能相关的网站，例如 **MIT 人工智能资讯** 和 **华尔街日报科技**，无需手动输入 URL。

## 技术栈

- **前端**：React, React Router
- **后端**：Flask
- **其他**：HTML, CSS, JavaScript

## 如何参与开发

如果你想参与到这个项目的开发中，可以按照以下步骤进行：

1. Fork 该仓库到你的 GitHub 账户。
2. 克隆你 Fork 的仓库到本地。
3. 创建一个新的分支，进行功能开发或者 bug 修复。
4. 提交改动并推送到你的远程仓库。
5. 创建 Pull Request，描述你的改动并提交请求合并。

## 注意事项

- 后端开发环境为 Flask 的开发服务器，请勿在生产环境中直接使用，建议使用 Nginx 等服务部署后端。
- 确保所有依赖项的版本兼容，以避免运行错误。

## 贡献者

- **Trista984** (项目创建者)





