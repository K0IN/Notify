ARG VARIANT="jammy"
FROM mcr.microsoft.com/vscode/devcontainers/base:0-${VARIANT}

# ENV DISPLAY=:99.0
ENV PUPPETEER_EXEC_PATH=google-chrome-stable

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends npm wget curl apt-transport-https ca-certificates curl gnupg-agent software-properties-common

RUN npm install -g n \
    && n 16.7.0

RUN sudo apt-get update \
    && sudo apt-get install -yq libgconf-2-4 \
    && sudo apt-get install -y wget xvfb --no-install-recommends \
    #   && sudo wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add - \
    #   && sudo sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    #   && sudo apt-get install -y google-chrome-stable --no-install-recommends \
    && sudo rm -rf /var/lib/apt/lists/*

RUN apt update \ 
    && apt install -y wget \
    && wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
    && apt install -y ./google-chrome-stable_current_amd64.deb
