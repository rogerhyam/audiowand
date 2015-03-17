#!/bin/bash
# This script uses rsync to keep the core code of a audiowand tour up to date with a clone from github.

rsync -avh --exclude 'data/*' audiowand/* www