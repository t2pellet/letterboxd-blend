FROM node:lts-alpine AS frontend-stage
WORKDIR /app
ENV NODE_ENV production
ENV PATH /letterboxd-blend/node_modules/.bin:$PATH
ARG VITE_API_ENDPOINT
ARG VITE_BASE_URL
COPY frontend/package.json .
COPY frontend/yarn.lock .
RUN yarn install --production=false
COPY ./frontend/. .
RUN yarn build

FROM python:3.10-bullseye AS deploy-stage
ENV PATH="/.venv/bin:$PATH"
ARG RPDB_API_KEY
# Install application into container
COPY start.sh .
COPY nginx.sh .
RUN chmod +rwx ./start.sh
RUN chmod +rwx ./nginx.sh
RUN bash ./nginx.sh
COPY --from=frontend-stage /app/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf.template
COPY backend/requirements.txt .
RUN pip3 install -r requirements.txt
COPY backend/src/. .
RUN echo "RPDB_API_KEY=$RPDB_API_KEY" > .env
RUN export "RPDB_API_KEY=$RPDB_API_KEY"
# Run the application
EXPOSE 80
CMD ["/bin/bash","-c","./start.sh"]