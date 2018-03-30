#!/bin/bash

curl -X POST http://localhost:3000/ -F 'file=@test.pdf' -o out.png
