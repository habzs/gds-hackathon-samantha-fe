FROM --platform=linux/amd64 node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx next build

FROM --platform=linux/amd64 node:20-alpine as runner
WORKDIR /app
COPY --from=builder --chown=node:node /app/package*.json ./
RUN npm install --only=production
COPY --from=builder --chown=node:node /app/.next ./.next

USER node
EXPOSE 3000
CMD ["npm", "run", "start"]