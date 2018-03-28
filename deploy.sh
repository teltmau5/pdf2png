#!/bin/bash
apt update
apt -y install supervisor poppler-utils nodejs

mkdir -p /var/pdf2png 

cp pdf2png.js /var/pdf2png/
cp package.json /var/pdf2png/
cp supervisor.conf /etc/supervisor/conf.d/pdf2png.conf

cd /var/pdf2png
npm install

supervisorctl reload
supervisorctl restart pdf2png

