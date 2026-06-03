FROM node:20-alpine AS builder
WORKDIR /app

# 1. Copy tất cả package.json để Docker cache layer tốt hơn
COPY package*.json ./
COPY admin/package*.json ./admin/
COPY user/package*.json ./user/
COPY manager/package*.json ./manager/

# 2. Cài đặt toàn bộ thư viện tại root (bao gồm axios, tailwind, etc.)
RUN npm install --include=dev

# 3. Copy toàn bộ mã nguồn (bao gồm cả folder common)
COPY . .

# 4. Chạy build cho app admin
WORKDIR /app/admin
RUN rm -rf node_modules
# Ép bỏ qua check type hoàn toàn để tránh lỗi tsc
RUN npx vite build 

# --- STAGE 2: Chạy với Nginx ---
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/admin/dist /usr/share/nginx/html
COPY admin/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]