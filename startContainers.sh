#!/bin/bash

NETWORK=area-421
PREDICTOR_HOSTNAME=predictor
PREDICTOR_PORT=8080

docker network create $NETWORK

docker run -d \
  -p 8080:8080
  --network=$NETWORK \
  --name=predictor \
  --rm \
  predictor &

docker run -d \
  -e PREDICTOR_HOSTNAME=$PREDICTOR_HOSTNAME
  -e PREDICTOR_PORT=$PREDICTOR_PORT
  -p 3000:3000 \
  --network=$NETWORK \
  --name=node-backend \
  --rm \
  node-backend &