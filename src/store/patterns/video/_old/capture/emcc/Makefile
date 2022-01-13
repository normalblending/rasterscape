build/matrixMultiply.mjs: matrixMultiply.cpp
	emcc --no-entry matrixMultiply.cpp -o build/matrixMultiply.mjs  \
	  -s TOTAL_MEMORY=100MB \
	  -s ALLOW_MEMORY_GROWTH=1 \
	  -s ENVIRONMENT='web'  \
	  -s SINGLE_FILE=1  \
	  -s EXPORT_NAME='createModule'  \
	  -s USE_ES6_IMPORT_META=0  \
	  -s EXPORTED_FUNCTIONS='["_paraboloidCutFunction",  "_initStack",  "_setDepth", "_matrixMultiply","_malloc", "_free"]'  \
	  -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]'  \
	  -s ASSERTIONS=1  \
	  -O0
