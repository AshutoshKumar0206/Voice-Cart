# Dockerfile
FROM node:18-alpine

WORKDIR /usr/src/app

# copy package files first for caching
COPY package*.json ./

RUN npm ci --only=production || npm install

# copy source
COPY . .

# expose port used by app (adjust if needed)
EXPOSE 3000

CMD ["node", "app.js"]
