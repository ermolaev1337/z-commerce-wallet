FROM node

WORKDIR /app
COPY ./frontend/package.json /app/package.json
RUN yarn
COPY ./frontend /app