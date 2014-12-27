# Dockerfile to build node js app for unitySchnippelLib
# WARNING: mongodb Dependency
# As for now mongodb is supposed to be run as a separate Docker Process

FROM ubuntu:14.04
MAINTAINER doemsche@gmx.ch
ENV REFRESHED_AT 2014-12-17
RUN apt-get update && apt-get install -y nodejs npm && apt-get install -y mongodb
RUN apt-get install -y git git-core
RUN mkdir -p /data/db

WORKDIR /tmp
RUN git clone https://github.com/doemsche/nodeSchnippelBuch.git

WORKDIR /tmp/nodeSchnippelBuch

RUN npm install

ENTRYPOINT [ "nodejs", "index.js", "db" ]

# From within docker container run:
# docker run -ti --name nodemongo -p 5000:5000 --link <node_container_name>:db doemsche/nodemongo