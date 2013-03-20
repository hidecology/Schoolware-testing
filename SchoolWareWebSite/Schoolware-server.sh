#!/bin/sh
TARGET_DIR="./temp_report"
if [ -d $TARGET_DIR ]
then
	rm -rf $TARGET_DIR
fi
java -jar ./JSCover-all.jar -ws --branch --document-root=. --report-dir=$TARGET_DIR

