FROM node:carbon-alpine as builder

MAINTAINER DPP <contact@dapowerplay.com>

ARG NODE_ENV=dev

RUN apk update && apk upgrade && apk add --no-cache dep python make g++ git bash

WORKDIR /usr/app

# Install node dependencies - done in a separate step so Docker can cache it.
COPY packag*.json ./

ENV NODE_ENV=$NODE_ENV

RUN npm install --from-lock-file


FROM node:carbon-alpine as app

WORKDIR /usr/app

COPY --from=builder /usr/app/node_modules/ ./node_modules

COPY . .

RUN mkdir data

RUN chown -R node:node .

USER node

EXPOSE 3000

CMD ["node", "./bin/www"]





