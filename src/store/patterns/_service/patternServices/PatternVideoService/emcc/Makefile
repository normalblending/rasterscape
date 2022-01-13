build/videoModule.mjs: videoModule.cpp
	emcc --no-entry videoModule.cpp pixelStack.cpp -o build/videoModule.mjs  \
	  -s TOTAL_MEMORY=1024MB \
	  -s ALLOW_MEMORY_GROWTH=1 \
	  -s ENVIRONMENT='web'  \
	  -s SINGLE_FILE=1  \
	  -s EXPORT_NAME='createModule'  \
	  -s USE_ES6_IMPORT_META=0  \
	  -s EXPORTED_FUNCTIONS='["_defaultCutFunction", "_paraboloidCutFunction", "_sis2CutFunction", "_arrayXCutFunction", "_arrayYCutFunction", "_channelCutFunction",  "_initStack",  "_setDepth", "_malloc", "_free"]'  \
	  -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]'  \
	  -s ASSERTIONS=1  \
	  -O3
