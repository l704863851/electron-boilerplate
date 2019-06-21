const webpack = require('webpack');
const merge = require('webpack-merge');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const path = require('path');
const HappyPack = require('happypack');
const os = require('os');

const baseConfig = require('./webpack.base.config');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length, id: 'ts' });

module.exports = merge.smart(baseConfig, {
    target: 'electron-main',
    entry: {
        main: path.resolve(__dirname, '../src/main/main.ts')
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: ['happypack/loader?id=ts']
            }
        ]
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            reportFiles: [path.resolve(__dirname, '../src/main/**/*')],
            checkSyntacticErrors: true
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        }),
        new HappyPack({
            threadPool: happyThreadPool,
            id: 'ts',
            use: [
                {
                    path: 'ts-loader',
                    query: {
                        happyPackMode: true,
                        transpileOnly: true,
                        configFile: path.resolve(__dirname, '../tsconfig.json')
                    }
                }
            ]
        })
    ]
});
