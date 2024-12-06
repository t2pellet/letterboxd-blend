FROM python:3.10.5-bullseye AS deploy-stage
ARG PORT
RUN pip install poetry
COPY . .
RUN poetry config virtualenvs.create false
RUN poetry install
# Run the application
EXPOSE $PORT
CMD gunicorn -b 0.0.0.0:${PORT} --chdir ./app --worker-class eventlet -w 1 app:app
