# THIS DOCKERFILE WAS USED IN THE LIVE SETTING WITH APPROPRIATE ENVIRONMENT VARIABLES

FROM node:16-alpine AS frontend

WORKDIR /app

COPY frontend/package.json .

RUN npm install

COPY frontend/ .

RUN npm run build_producton


FROM python:3.8
WORKDIR /app

RUN apt-get update && apt-get -y install cmake libeigen3-dev
RUN pip install git+https://github.com/yuki-koyama/sequential-line-search

COPY backend/requirements.txt /app/
RUN pip install -r ./requirements.txt

RUN mkdir /app/static_html

COPY --from=frontend /app/static_html /app/static_html/

COPY backend/bayesian.py /app/

CMD gunicorn --bind 0.0.0.0:5000 --threads=100 bayesian:app
