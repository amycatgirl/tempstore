FROM denoland/deno:alpine

RUN mkdir -p /www/tempstore

WORKDIR /www/tempstore
ADD . /www/tempstore/

EXPOSE 5544

CMD [ "deno", "task", "start" ]