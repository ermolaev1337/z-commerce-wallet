FROM node:latest

WORKDIR /app
COPY ./backend/package.json /app/package.json
RUN yarn
COPY ./backend /app