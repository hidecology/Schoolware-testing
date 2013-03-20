#!/bin/sh
OUTPUT_DIR="./report"
SRC_DIR="./temp_report"
TMP_DIR="./old_report"
if [ -d $OUTPUT_DIR ]
then
	mv $OUTPUT_DIR $TMP_DIR
	java -cp ./JSCover-all.jar jscover.report.Main --merge $SRC_DIR $TMP_DIR $OUTPUT_DIR
	rm -rf $SRC_DIR
	rm -rf $TMP_DIR
else
	cp -r $SRC_DIR $OUTPUT_DIR
fi
