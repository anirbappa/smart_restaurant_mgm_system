# syntax=docker/dockerfile:1.4

# Build stage
FROM node:22-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

# 1. Declare the ARG argument parameter
ARG REACT_APP_API_URL
# 2. Inject it into the environment scope during compilation
ENV REACT_APP_API_URL=$REACT_APP_API_URL


# Production stage
FROM nginx:stable-alpine

COPY --from=build /usr/src/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
