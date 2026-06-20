FROM node:24-alpine AS deps

WORKDIR /app

COPY package*.json .

# install npm dependencies (including dev dependencies for build)
RUN npm ci

# copy source code (.dockerignore will take care of unwanted files)
COPY . .

# work around prisma little bullshit, so stupid ... (-_-")
ARG DATABASE_URL=postgresql://user:pass@localhost:5432/db?schema=public

RUN npx prisma generate

# use non-root user for security (built into node alpine image)
USER node

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

HEALTHCHECK \
    --interval=30s \
    --timeout=5s \
    --start-period=10s \
    --retries=3 \
    CMD wget -qO- http://localhost:$PORT/health || exit 1

# rum server
CMD ["npx", "tsx", "src/index.ts"]
