FROM node:carbon-alpine as builder

MAINTAINER DPP <contact@dapowerplay.com>

RUN apk add --no-cache --virtual dep python make g++ git

WORKDIR /usr/app

# Install node dependencies - done in a separate step so Docker can cache it.
COPY packag*.json ./

RUN npm install --from-lock-file


FROM node:carbon-alpine as app

WORKDIR /usr/app

COPY --from=builder /usr/app/node_modules/ ./node_modules

COPY . .

RUN chown -R node:node .

USER node

EXPOSE 3000

CMD ["node", "./bin/www"]





