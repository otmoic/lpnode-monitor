FROM docker.io/library/node:16.10.0-buster
ADD ./ /data/lp_node_monitor/
EXPOSE 18081
WORKDIR /data/lp_node_monitor/
RUN apt-get update
RUN yes|apt-get install libusb-1.0-0-dev
RUN yes|apt-get install libudev-dev
RUN npm i
# build
RUN npx gulp

