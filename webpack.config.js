'use strict';

const webpack = require('webpack');
const path = require('path');
const packageData = require('./package.json');

const plugins = [
    new webpack.DefinePlugin({
        __VERSION__: JSON.stringify(packageData.version),
        __NAME__: JSON.stringify(packageData.name)
    })
];

const config = {
    context: __dirname + '/src',
    entry: {
        "thumbnail-embed": 'thumbnail-embed/index.ts',
        "playkit-player-scripts": 'v2-to-v7/index.ts'
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].js',
    },
    devtool: 'inline-source-map',
    plugins: plugins,
    module: {
        rules: [
            {
                test: /\.ts?$/,
                loader: 'ts-loader',
                options: {
                    configFile: path.resolve('./tsconfig.json')
                },
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
        modules: [path.resolve(__dirname, 'src'), 'node_modules']
    },
};

module.exports = () => {
    config.mode = 'production';
    return config;
};
