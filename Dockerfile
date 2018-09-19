FROM node:10.8.0-alpine

WORKDIR /app

COPY . .

RUN yarn --production && yarn cache clean

EXPOSE 3000:3000

CMD ["yarn", "start"]
