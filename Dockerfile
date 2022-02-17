FROM node:16.6.2-bullseye-slim


WORKDIR /app
COPY package*.json ./

RUN npm install
RUN npm ci --only=production

COPY . .

EXPOSE 8080
CMD [ "node", "src/server" ]