const {join} = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ref = process.cwd()

module.exports = {
    entry: fromHere('src/app'),

    output   : {
        path    : fromHere('./docs'),
        filename: '[name].js',
    },
    resolve  : {
        alias: {

        }
    },
    module   : {
        rules: [
            {
                test   : /\.js$/,
                exclude: /(node_modules)/,
                use    : ['babel-loader',],
            },
            {
                test   : /\.json$/,
                exclude: /(node_modules)/,
                use    : ['json-loader',],
            },
            {
                test: /\.css$/,
                use : ['style-loader', 'css-loader',],
            },
            {
                test: /\.(jpe?g|png|gif|svg|ttf|woff2?)$/,
                use : ['file-loader',],
            },
            {
                test: /\.hmtl$/,
                use : ['html-loader',],
            }
        ],
    },
    devServer: {
        historyApiFallback: true,
        host              : '0.0.0.0',
    },
    plugins  : [
        new CopyWebpackPlugin([
            {from: 'static'}
        ]),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: '!!html-loader?interpolate=require!' + fromHere('src/index.html'),
        }),
    ],
}

function fromHere(...args) {
    return join(ref, ...args)
}
