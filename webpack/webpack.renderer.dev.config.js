const merge = require('webpack-merge');
const spawn = require('child_process').spawn;
const path = require('path');
const HappyPack = require('happypack');
const os = require('os');

const baseConfig = require('./webpack.renderer.config');
const theme = require('./antdTheme');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length, id: 'ts' });

module.exports = merge.smart(baseConfig, {
    resolve: {
        alias: {
            'react-dom': '@hot-loader/react-dom'
        }
    },
    devServer: {
        port: 2003,
        compress: true,
        noInfo: true,
        stats: 'errors-only',
        inline: true,
        hot: true,
        headers: { 'Access-Control-Allow-Origin': '*' },
        historyApiFallback: {
            verbose: true,
            disableDotRule: false
        },
        before() {
            if (process.env.START_HOT) {
                console.log('Starting main process');
                spawn('npm', ['run', 'start-main-dev'], {
                    shell: true,
                    env: process.env,
                    stdio: 'inherit'
                })
                    .on('close', code => process.exit(code))
                    .on('error', spawnError => console.error(spawnError));
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: ['happypack/loader?id=ts']
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                include: /node_modules/
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                loaders: ['style-loader', 'css-loader?modules&localIdentName=[local]-[hash:base64:5]', 'sass-loader']
            },
            {
                test: /.*\.less$/,
                use: ['style-loader', 'css-loader', { loader: 'less-loader', options: { modifyVars: theme } }],
                include: /node_modules/
            }
        ]
    },
    plugins: [
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