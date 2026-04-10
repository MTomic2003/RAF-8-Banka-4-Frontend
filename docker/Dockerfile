# syntax=docker/dockerfile:1.7
FROM node:lts-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
  npm ci

COPY ./src ./src
COPY ./public ./public
COPY ./*.html ./
COPY ./*.ts ./
COPY ./*.js ./
RUN npm run build


FROM nginx:alpine

COPY --from=build /app/dist /app/www

RUN cat > /etc/nginx/conf.d/default.conf <<'EOF'
server {
  listen 80;
  root /app/www;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
EOF

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]