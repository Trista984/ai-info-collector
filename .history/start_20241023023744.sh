#!/bin/bash

# 进入后端目录并激活虚拟环境
echo "Starting backend server..."
cd backend || exit
source .venv/bin/activate
# 使用 `nohup` 后台运行 Flask 服务器，并重定向输出
nohup python3 app.py > backend.log 2>&1 &

# 进入前端目录并启动开发服务器
echo "Starting frontend server..."
cd ../frontend || exit
npm install
npm start
