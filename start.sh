#! /usr/bin/env bash
export "$(cat .env)"
echo "KEY: $RPDB_API_KEY"
envsubst '\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
nginx -g 'daemon off;' & gunicorn -b '[::1]:8000' --worker-class eventlet -w 1 main:app
