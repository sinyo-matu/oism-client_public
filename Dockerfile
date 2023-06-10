FROM node:16-alpine as BUILD_IMAGE

WORKDIR /app
COPY package.json yarn.lock ./
# install dependencies
RUN yarn install --frozen-lockfile
COPY . .
# build
RUN yarn build
# remove dev dependencies
RUN npm prune --production


FROM node:alpine
WORKDIR /app
# copy from build image
COPY --from=BUILD_IMAGE /app/package.json ./package.json
COPY --from=BUILD_IMAGE /app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /app/.next ./.next
COPY --from=BUILD_IMAGE /app/public ./public
COPY --from=BUILD_IMAGE /app/.env.production ./.env.production
COPY --from=BUILD_IMAGE /app/next.config.js ./next.config.js
COPY --from=BUILD_IMAGE /app/next-i18next.config.js ./next-i18next.config.js

EXPOSE 3000
CMD ["yarn", "start"]