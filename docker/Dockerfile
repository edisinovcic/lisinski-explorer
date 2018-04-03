FROM node:8

RUN mkdir -p /usr/src/app && mkdir -p /usr/src/app/data 

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

ADD . /usr/src/app

WORKDIR /usr/src/app

RUN git submodule init && git submodule update && git submodule status

RUN npm install && npm cache clean --force

RUN chown -R 1000920000:0 /usr/src/app/data/

EXPOSE 3000

USER 1000920000

CMD [ "npm", "start" ]