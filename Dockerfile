FROM node:lts-alpine AS frontend-stage
WORKDIR /app
ENV PATH /letterboxd-blend/node_modules/.bin:$PATH
ENV VITE_API_ENDPOINT /api
ENV VITE_BASE_URL https://letterboxd.tenzin.live
ENV NODE_ENV production
COPY frontend/package.json .
COPY frontend/yarn.lock .
RUN yarn install --production=false
COPY ./frontend/. .
RUN yarn build

FROM python:3.10-bullseye AS deploy-stage
ENV PATH="/.venv/bin:$PATH"
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
# Run the application
EXPOSE 80
CMD ["/bin/bash","-c","./start.sh"]