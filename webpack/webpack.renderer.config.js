const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const path = require('path');

const baseConfig = require('./webpack.base.config');

module.exports = merge.smart(baseConfig, {
    target: 'electron-renderer',
    entry: {
        renderer: path.resolve(__dirname, '../src/renderer/App.tsx')
    },
    module: {
        rules: [
            {
                test: /\.(gif|png|jpe?g|svg|bmp)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: 'img/[hash:8].[name].[ext]'
                        }
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ['file-loader'],
                exclude: /node_modules/
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader'
            }
        ]
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            reportFiles: [path.resolve(__dirname, '../src/renderer/**/*')],
            checkSyntacticErrors: true
        }),
        new webpack.NamedModulesPlugin(),
        new HtmlWebpackPlugin(),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        })
    ]
});
