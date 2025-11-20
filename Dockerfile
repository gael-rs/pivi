# Imagen base
FROM node:20

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY crud-api/package*.json ./
RUN npm install

COPY crud-api/. .

EXPOSE 3000

CMD ["npm", "start"]

