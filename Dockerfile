FROM node:18

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
RUN npm install nodemailer

COPY . .
RUN npm run build

EXPOSE 3001
CMD ["npm", "run", "start"]