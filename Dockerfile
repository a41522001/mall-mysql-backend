FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
RUN npm run build

FROM node:22

WORKDIR /app
COPY package*.json ./
RUN npm install --production

COPY --from=builder /app/dist ./dist
EXPOSE 3888
CMD ["npm", "run", "start"]