# 使用官方的 Node.js 镜像作为基础镜像
FROM node:latest

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 文件
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制项目的所有文件到工作目录
COPY . .

# 构建项目
RUN npm run build

# 使用 nginx 作为 web 服务器
FROM nginx:alpine

# 复制构建的文件到 nginx 的 html 目录
COPY --from=0 /app/build /usr/share/nginx/html

# 暴露端口
EXPOSE 8080

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]