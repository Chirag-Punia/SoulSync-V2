
FROM node:20-slim as builder


WORKDIR /usr/src/app


COPY package*.json ./


RUN npm install


COPY . .


RUN npm run build


FROM nginx:alpine


COPY nginx.conf /etc/nginx/conf.d/default.conf


COPY --from=builder /usr/src/app/dist /usr/share/nginx/html


EXPOSE 5173


CMD ["nginx", "-g", "daemon off;"]