#!/bin/bash
# this works on a mac for creating MP4 files from txt files as synthetic voice stuff for testing.
cd ../../www/data/scripts
for F in *.txt
do
    N=`basename $F .txt`
    `say -v samantha -f $F -r 135 -o $N.mp4`
	echo $N
done