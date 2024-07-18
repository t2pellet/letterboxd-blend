FROM node:lts-alpine

WORKDIR /letterboxd-blend

ENV PATH /letterboxd-blend/node_modules/.bin:$PATH
ENV VITE_API_ENDPOINT http://0.0.0.0:5000

COPY package.json .
COPY yarn.lock .

RUN npm install -g http-server
RUN yarn install

COPY . .

RUN yarn build

EXPOSE 8080
CMD ["http-server", "dist", "--proxy", "http://localhost:8080?"]