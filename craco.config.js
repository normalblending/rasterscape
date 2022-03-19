const { addBeforeLoader, loaderByName } = require('@craco/craco');

module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            const wasmExtensionRegExp = /\.wasm$/;
            webpackConfig.resolve.extensions.push('.wasm');

            webpackConfig.module.rules.forEach((rule) => {
                (rule.oneOf || []).forEach((oneOf) => {
                    if (oneOf.loader && oneOf.loader.indexOf('file-loader') >= 0) {
                        oneOf.exclude.push(wasmExtensionRegExp);
                    }
                });
            });

            const wasmLoader = { // это не нужно тк emcc генерит сразу js
                test: /\.wasm$/,
                exclude: /node_modules/,
                loaders: ['arraybuffer-loader'],
                type: "javascript/auto"
            };

            const glslLoader = {
                test: /\.glsl$/,
                exclude: /node_modules/,
                loaders: ['raw-loader'],
                // type: "javascript/auto"
            };

            addBeforeLoader(webpackConfig, loaderByName('file-loader'), wasmLoader);

            addBeforeLoader(webpackConfig, loaderByName('file-loader'), glslLoader);

            return webpackConfig;
        },
    },
};
