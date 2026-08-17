FROM node:20

WORKDIR /app
COPY ./frontend/package.json ./frontend/yarn.lock /app/
RUN yarn --frozen-lockfile
COPY ./frontend /app