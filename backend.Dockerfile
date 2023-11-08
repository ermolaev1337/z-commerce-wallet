FROM node:latest

WORKDIR /app
COPY ./api/package.json /app/package.json
RUN yarn install
COPY ./api /app

ENTRYPOINT ["yarn", "start"]