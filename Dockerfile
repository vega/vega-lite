FROM node:14-buster-slim
RUN apt-get update
RUN apt-get install -y git ruby ruby-dev build-essential rsync vim chromium
RUN git clone https://github.com/vega/vega-lite.git
RUN gem install bundler

WORKDIR /vega-lite
ENV LC_ALL "C.UTF-8"
ENV LANG "en_US.UTF-8"
ENV LANGUAGE "en_US.UTF-8"
RUN rm /bin/sh && ln -s /bin/bash /bin/sh
RUN yarn
RUN cd /vega-lite/site && bundle install
