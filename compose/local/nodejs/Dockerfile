FROM node:16-alpine

ENV NODE_ENV local
COPY package*.json ./

RUN npm install

COPY . .

WORKDIR /app
CMD ["npm", "run", "dev"]