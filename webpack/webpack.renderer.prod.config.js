const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const tsImportPluginFactory = require('ts-import-plugin');
const path = require('path');
const HappyPack = require('happypack');
const os = require('os');

const baseConfig = require('./webpack.renderer.config');
const theme = require('./antdTheme');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length, id: 'ts' });

module.exports = merge.smart(baseConfig, {
    mode: 'production',
    output: {
        filename: '[name].[chunkhash:8].js',
        publicPath: '/',
        chunkFilename: '[name].[chunkHash:8].js'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ['happypack/loader?id=ts'],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
                include: /node_modules/
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                loaders: [MiniCssExtractPlugin.loader, 'css-loader?modules&localIdentName=[local]-[hash:base64:5]', 'sass-loader']
            },
            {
                test: /.*\.less$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', { loader: 'less-loader', options: { modifyVars: theme } }],
                include: /node_modules/
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash:8].css',
            chunkFilename: '[name].[contenthash:8].css'
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
                        configFile: path.resolve(__dirname, '../tsconfig.json'),
                        getCustomTransformers: () => ({
                            before: [
                                tsImportPluginFactory([
                                    {
                                        libraryName: 'antd',
                                        style: true
                                    }
                                ])
                            ]
                        })
                    }
                }
            ]
        })
    ]
});
