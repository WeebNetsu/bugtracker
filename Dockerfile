FROM node:16-buster

COPY . /app

WORKDIR /app

# RUN apk update && apk add postgresql

RUN npm i

CMD ["npm", "start"]