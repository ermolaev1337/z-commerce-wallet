FROM node:20

WORKDIR /app
COPY ./backend/package.json ./backend/yarn.lock /app/
RUN yarn --frozen-lockfile
COPY ./backend /app