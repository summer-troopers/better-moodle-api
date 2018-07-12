FROM node:10.6.0

WORKDIR /usr/src/app

COPY . .

RUN npm install

CMD [ "npm", "start" ]
