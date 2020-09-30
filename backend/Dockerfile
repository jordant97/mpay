FROM node:12.18.4

WORKDIR /usr/src/app 

COPY package*.json ./

RUN npm install 

COPY . . 

EXPOSE 8888 

ENV NODE_ENV=production

CMD ["node", "index.js"]

