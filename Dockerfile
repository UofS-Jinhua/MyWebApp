FROM node:14-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# 检查构建目录是否存在
RUN ls -la /app/dist

FROM nginx:latest 

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80