FROM node:16 -buster-slim
# install base development tools
RUN apt-get update && apt-get install -y git ruby ruby-dev build-essential rsync chromium parallel

# make /bin/sh running /bin/bash
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# install bundler
USER node
RUN mkdir -p /home/node/.gem/ruby/2.5.0/bin
ENV PATH=/home/node/.gem/ruby/2.5.0/bin:$PATH
RUN gem install bundler --user-install
ENV GEM_HOME=/home/node/.gem/
ENV LC_ALL "C.UTF-8"
ENV LANG "en_US.UTF-8"
ENV LANGUAGE "en_US.UTF-8"

