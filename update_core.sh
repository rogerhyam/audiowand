#!/bin/bash
# This script uses rsync to keep the core code of a audiowand tour up to date with a clone from github.

cd audiowand
git pull
cd ..

rsync -avh --exclude-from 'audiowand/exclude_from_build.txt' audiowand/* www