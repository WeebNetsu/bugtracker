FROM node:16-buster

COPY . /site

WORKDIR /site

# RUN apk update && apk add postgresql

RUN npm i

CMD ["npm", "start"]