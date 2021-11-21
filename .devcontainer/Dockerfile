FROM node:16-buster-slim
# install base development tools
RUN apt-get update && apt-get install -y git ruby ruby-dev build-essential rsync \
  parallel python3 libpixman-1-dev libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev \
  zlib1g-dev liblzma-dev patch pkg-config

# chrome dependencies for puppeteer
# copied from here https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#chrome-headless-doesnt-launch-on-unix
# need to be cleaned up with above
RUN apt-get install -y ca-certificates fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 \
libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 \
libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 \
libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 \
libxss1 libxtst6 lsb-release wget xdg-utils



# make /bin/sh run /bin/bash
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN apt-get install -y curl
RUN bash -c "bash <(curl -s https://raw.githubusercontent.com/borkdude/jet/master/install)"
RUN curl -O -L  https://github.com/borkdude/puget-cli/releases/download/v0.0.3/puget-cli-0.0.3-linux-amd64.zip && unzip puget-cli-0.0.3-linux-amd64.zip -d /usr/local/bin/

USER node
RUN mkdir -p /home/node/.gem/ruby/2.5.0/bin
ENV PATH=/home/node/.gem/ruby/2.5.0/bin:$PATH
RUN gem install bundler --user-install
RUN gem install nokogiri --platform=ruby --user-install
ENV GEM_HOME=/home/node/.gem/
ENV LC_ALL "C.UTF-8"
ENV LANG "en_US.UTF-8"
ENV LANGUAGE "en_US.UTF-8"
