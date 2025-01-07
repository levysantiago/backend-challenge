#!/bin/sh
cd usr/corrections-service
yarn --frozen-lockfile
yarn build
yarn start:prod