# syntax=docker/dockerfile:1

FROM node:22-bullseye-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

FROM node:22-bullseye-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
COPY . .
RUN npx prisma generate && npm run build

FROM node:22-bullseye-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4001
RUN addgroup --system app && adduser --system --ingroup app app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/dist ./dist
COPY package.json package-lock.json prisma.config.ts ./
COPY prisma ./prisma
COPY server ./server
COPY public ./public
RUN mkdir -p uploads && chown -R app:app /app
USER app
EXPOSE 4001
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 CMD /bin/sh -c "node -e \"(async ()=>{try{const res=await fetch('http://127.0.0.1:'+ (process.env.PORT || 4001) + '/health');process.exit(res.ok?0:1)}catch(e){process.exit(1)}})()\""
CMD ["node","server/api-server.js"]
