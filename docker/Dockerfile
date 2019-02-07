FROM registry.access.redhat.com/rhscl/nodejs-8-rhel7:1-11

MAINTAINER DPP <contact@dapowerplay.com>

COPY package.json /opt/app-root/
COPY package-lock.json /opt/app-root/

WORKDIR /opt/app-root/

EXPOSE 3000

USER 1001

RUN bash -c "npm install --from-lockfile" && \
    bash -c "npm cache clean --force"

COPY . .

RUN fix-permissions /opt/app-root

CMD [ "npm", "start" ]





