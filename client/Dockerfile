FROM node:16-buster

COPY . /client

WORKDIR /client

# RUN apk update && apk add postgresql

RUN npm i

CMD ["npm", "start"]