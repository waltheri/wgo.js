#!/bin/bash
TOPDIR=$(git rev-parse --show-toplevel)

# check if google closure compiler is installed
if [ ! -e "$TOPDIR/compiler/compiler.jar" ]; then
	echo "Google closure compiler not found. Downloading it from "
	echo
	echo "    http://dl.google.com/closure-compiler/compiler-latest.zip"
	echo
	echo "and extracting it to the bin/compiler folder."
	echo

	mkdir -p $TOPDIR/compiler
	cd $TOPDIR/compiler
	wget http://dl.google.com/closure-compiler/compiler-latest.zip
	unzip compiler-latest.zip
fi

echo '-----------------------------'
echo ' Compressing JavaScript files'
echo '-----------------------------'
cd $TOPDIR/wgo

# compress wgo.js
java -jar $TOPDIR/compiler/compiler.jar \
	--language_in ECMASCRIPT5 \
	--js_output_file=_tmp.js wgo.js

# prepend licence information
echo -n '/*! MIT license, more info: wgo.waltheri.net */' > wgo.min.js
cat _tmp.js >> wgo.min.js
rm _tmp.js

# compress player
java -jar $TOPDIR/compiler/compiler.jar \
	--language_in ECMASCRIPT5 \
	--js_output_file=_tmp.js \
		kifu.js \
		sgfparser.js \
		player.js \
		basicplayer.js \
		basicplayer.component.js \
		basicplayer.infobox.js \
		basicplayer.commentbox.js \
		basicplayer.control.js \
		player.editable.js \
		scoremode.js \
		player.permalink.js

# prepend licence information
echo -n '/*! MIT license, more info: wgo.waltheri.net */' > wgo.player.min.js
cat _tmp.js >> wgo.player.min.js
rm _tmp.js