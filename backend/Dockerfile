FROM node:18-alpine AS deploy-stage
ARG PORT
ENV NODE_ENV production
ENV PORT ${PORT}
COPY . .
RUN npm install -g yarn
RUN yarn install
RUN yarn build
EXPOSE $PORT
CMD ["yarn","start"]