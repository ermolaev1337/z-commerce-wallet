FROM node:latest
#TODO maybe we should keep the chekout frontend in its own folder (as api)
WORKDIR /app
COPY ./package.json /app/package.json
RUN yarn install
COPY ./ /app/

CMD ["yarn", "run", "web"]
