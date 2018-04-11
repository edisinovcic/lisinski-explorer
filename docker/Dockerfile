FROM registry.access.redhat.com/rhscl/nodejs-8-rhel7:1-11

MAINTAINER DPP <contact@dapowerplay.com>

ADD . /opt/app-root/

WORKDIR /opt/app-root/

EXPOSE 3000

USER 1001

RUN bash -c "npm install" && \
    bash -c "npm cache clean --force"

RUN fix-permissions /opt/app-root

CMD [ "npm", "start" ]





