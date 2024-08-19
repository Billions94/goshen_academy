FROM node:alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install glob rimraf
RUN npm install ts-node-dev
RUN npm install express-api-cache
RUN npm install bcrypt
RUN npm install reflect-metadata
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "run", "start"]