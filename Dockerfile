FROM node:17

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 9355
CMD [ "node", "ex.js" ]