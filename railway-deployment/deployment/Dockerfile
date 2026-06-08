FROM node:20-bullseye-slim AS base
WORKDIR /usr/src/app

COPY app/package*.json ./
COPY app/vite.config.js ./
COPY app/jsconfig.json ./
COPY app/index.html ./

RUN npm ci --omit=dev

FROM base AS build
WORKDIR /usr/src/app
COPY app/ ./
RUN npm run build

FROM node:20-bullseye-slim AS release
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/server ./server
COPY --from=build /usr/src/app/scripts ./scripts
COPY --from=build /usr/src/app/package*.json ./

RUN npm ci --omit=dev

ENV NODE_ENV=production
ENV PORT=4001
EXPOSE 4001
CMD ["bash", "./scripts/start.sh"]
