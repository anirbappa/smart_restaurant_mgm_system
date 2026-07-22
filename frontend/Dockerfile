# syntax=docker/dockerfile:1.4

# Build stage
FROM node:22-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
# If a Docker build secret named `react_app_api_url` is provided, write it
# into a .env file so the React build picks up REACT_APP_API_URL at build time.
RUN --mount=type=secret,id=react_app_api_url \
	sh -c 'if [ -s /run/secrets/react_app_api_url ]; then printf "REACT_APP_API_URL=%s\n" "$(cat /run/secrets/react_app_api_url)" > .env; fi' \
	&& npm run build

# Production stage
FROM nginx:stable-alpine

COPY --from=build /usr/src/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
