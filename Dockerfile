# Stage 1: dependencies
FROM node:24-alpine AS deps

WORKDIR /app

COPY package*.json .

# install npm dependencies (including dev dependencies for build)
RUN npm ci --ignore-scripts

# Stage 2: build
FROM node:24-alpine AS build

WORKDIR /app

# copy deps from previous stage
COPY --from=deps /app/node_modules ./node_modules

# copy source code (.dockerignore will take care of unwanted files)
COPY . .

# compile typescript
RUN npm run build

# Stage 3: stage
FROM node:24-alpine AS stage

# build arguments
ARG PORT=4000

# define enviroment variables
ENV PORT=$PORT
ENV NODE_ENV="production"

WORKDIR /app

# copy files from the first stage into seconds stage workdir
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json .

# install ONLY production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# use non-root user for security (built into node alpine image)
USER node

EXPOSE $PORT

HEALTHCHECK \
    --interval=30s \
    --timeout=5s \
    --start-period=10s \
    --retries=3 \
    CMD wget -qO- http://localhost:$PORT/health || exit 1

# rum server
CMD [ "node", "dist/index.js" ]
