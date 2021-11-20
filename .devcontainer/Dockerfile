FROM node:16-buster-slim
# install base development tools
RUN apt-get update && apt-get install -y git ruby ruby-dev build-essential rsync chromium parallel python3 libpixman-1-dev libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev

# make /bin/sh run /bin/bash
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN apt-get install -y zlib1g-dev liblzma-dev patch pkg-config
USER node
RUN mkdir -p /home/node/.gem/ruby/2.5.0/bin
ENV PATH=/home/node/.gem/ruby/2.5.0/bin:$PATH
RUN gem install bundler --user-install
RUN gem install nokogiri --platform=ruby --user-install
ENV GEM_HOME=/home/node/.gem/
ENV LC_ALL "C.UTF-8"
ENV LANG "en_US.UTF-8"
ENV LANGUAGE "en_US.UTF-8"


