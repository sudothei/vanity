FROM node:latest as build-stage
WORKDIR /app
COPY package.json /app/
COPY yarn.lock /app/
RUN yarn
COPY ./ /app/
ENV PATH /app/node_modules/.bin:$PATH
RUN yarn run build

FROM alpine/openssl as generate-certs
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout web.key -out web.crt -subj \
    /C=${COUNTRY}/ST=${STATE}/L=${LOCATION}/O=${ORGANIZATION}/OU=${ORGANIZATIONAL_UNIT}/CN=${COMMON_NAME}

FROM nginx:latest
COPY --from=build-stage /app/build/ /app/build
COPY --from=generate-certs ./ /etc/nginx/certs
COPY ./web.conf /etc/nginx/conf.d/web.conf

USER web
