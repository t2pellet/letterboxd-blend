#! /usr/bin/env bash
envsubst '\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
nginx -g 'daemon off;' & gunicorn -b '[::1]:8080' --worker-class eventlet -w 1 main:app
