FROM node:lts-alpine as build-stage
WORKDIR /app
ENV PATH /letterboxd-blend/node_modules/.bin:$PATH
ENV VITE_API_ENDPOINT /api
ENV NODE_ENV production
COPY package.json .
COPY yarn.lock .
RUN yarn install
RUN npm install -g npm-run-all
COPY . .
RUN yarn build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
