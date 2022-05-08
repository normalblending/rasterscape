const { resolve } = require('path');

const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = env => ({
    mode: 'development',
    devtool: 'source-map',
    entry: './src/index.tsx',
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
        symlinks: true,
        alias: {
            "react": resolve('./node_modules/react'),
            "store": resolve('./src/store'),
            "utils": resolve('./src/utils'),
            "components": resolve('./src/components'),
        },

    },
    output: {
        filename: 'main.js',
        path: resolve(__dirname, env && env.output || 'build')
    },
    module: {
        rules: [{
            test: /\.(ts|tsx)$/,
            exclude: [/node_modules/],
            loader: "ts-loader"
        }, {
            test: /\.(js)$/,
            exclude: [/node_modules/],
            loader: "babel-loader"
        },{
            test: /\.s[ac]ss$/i,
            use: [
                // Creates `style` nodes from JS strings
                "style-loader",
                // Translates CSS into CommonJS
                "css-loader",
                // Compiles Sass to CSS
                "sass-loader",
            ],
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }, {
            test: /\.(png|jpe?g|gif|webp)$/i,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        publicPath: 'img',
                        outputPath: 'img',
                        useRelativePath: true
                    },
                },
            ],
        }, {
            test: /\.stl$/,
            loader: 'url-loader'
        }, {
            test: /\.wasm$/,
            loader: "wasm-loader"
        }, {
            test: /\.glsl$/,
            loader: "raw-loader"
        }, ]
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: __dirname + '/src/index.html',
            filename: 'index.html',
            inject: 'body'
        }),
    ],
});
