# syntax=docker/dockerfile:1
# Railway Docker builder — build context: repository root
# Set in railway.json: "builder": "DOCKERFILE", "dockerfilePath": "deployment/railway/Dockerfile"

FROM node:22-bullseye-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
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
ENV SERVE_STATIC=true
RUN addgroup --system app && adduser --system --ingroup app app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/dist ./dist
COPY package.json package-lock.json prisma.config.ts ./
COPY prisma ./prisma
COPY server ./server
COPY public ./public
COPY deployment/railway/scripts/railway-start.sh ./deployment/railway/scripts/railway-start.sh
RUN mkdir -p uploads && chown -R app:app /app
USER app
EXPOSE 4001
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD node -e "(async()=>{try{const p=process.env.PORT||process.env.REG_SERVER_PORT||4001;const r=await fetch('http://127.0.0.1:'+p+'/health');process.exit(r.ok?0:1)}catch(e){process.exit(1)}})()"
CMD ["sh", "deployment/railway/scripts/railway-start.sh"]
