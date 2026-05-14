FROM node:lts-alpine

WORKDIR /workspace/app

COPY app/package*.json ./

RUN npm install

COPY app/ .

CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]
