#! /usr/bin/env bash
nginx -g 'daemon off;' & python app.py;
