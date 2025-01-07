#!/bin/sh
cd usr/backend-challenge
npx prisma migrate deploy
yarn --frozen-lockfile
yarn build
yarn start:prod