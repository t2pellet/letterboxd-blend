#! /usr/bin/env bash
nginx -g 'daemon off;' & gunicorn -b 127.0.0.1:8080 -b '[::1]:8080' --worker-class eventlet -w 1 main:app
