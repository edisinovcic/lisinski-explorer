FROM node:8.9.3

RUN mkdir -p /el && mkdir -p /el/data 

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

ADD . /el/

WORKDIR /el/

# RUN git submodule init && git submodule update && git submodule status

RUN chown -R 1000920000:0 /el/

RUN npm install && npm cache clean --force

EXPOSE 3000

USER 1000920000

CMD [ "npm", "start" ]