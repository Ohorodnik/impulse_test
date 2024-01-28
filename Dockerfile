FROM node:20.11.0-bookworm-slim as base
EXPOSE 3000
RUN apt-get update -y && apt-get install -y openssl
USER node
WORKDIR /app
ENV PATH=/app/node_modules/.bin:$PATH

FROM base as build
COPY --chown=node:node . .
RUN npm ci
RUN npx @nestjs/cli@latest build

FROM base as prod
ENV NODE_ENV=production
COPY --chown=node:node package*.json ./
COPY --chown=node:node prisma/ ./prisma/
RUN npm ci --omit=dev && npm cache clean --force
COPY --chown=node:node --from=build /app/dist/ ./dist/
RUN npx prisma generate
CMD [  "npm", "run", "start:migrate:prod" ] 
