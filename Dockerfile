###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:lts-bullseye-slim@sha256:fa342ba2bc67bc94e5ba27ee2fb030a945936acac30c2dc1b70c52738d50994c As development

WORKDIR /usr/app

## DEPENDENCIES
FROM development AS dependencies

ENV NODE_ENV=production

COPY package.json ./
COPY ./prisma ./prisma

RUN npm pkg delete scripts.postinstall

RUN yarn install
###################
# BUILD FOR PRODUCTION
###################

## BUILD
FROM development AS builder


COPY package.json tsconfig.json ./
COPY ./prisma ./prisma
RUN npm pkg delete scripts.postinstall

RUN yarn install
COPY ./ ./

RUN yarn build

###################
# PRODUCTION
###################

FROM node:lts-bullseye-slim@sha256:fa342ba2bc67bc94e5ba27ee2fb030a945936acac30c2dc1b70c52738d50994c As final

RUN apt-get update -y && apt-get install --no-install-recommends --no-install-suggests -y dumb-init \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

WORKDIR /usr/app

COPY --chown=node:node package.json ./
COPY --chown=node:node ./prisma ./prisma
COPY --chown=node:node ./scripts/entrypoint.sh  ./
COPY --from=dependencies --chown=node:node /usr/app/node_modules ./node_modules
COPY --from=builder /usr/app/dist ./dist

RUN chmod +x ./entrypoint.sh && chown node:node /usr/app

EXPOSE 3001
USER node

####### TARGETS

FROM final AS production

ENTRYPOINT ["/usr/bin/dumb-init", "--"]

CMD ["/bin/bash", "-c", "./entrypoint.sh"]
