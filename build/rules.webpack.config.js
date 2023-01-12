const path = require('path');
const shared = require('./shared.webpack.config');

module.exports = {
    ...shared,
    target: 'node',
    // module: {
    //     rules: [
    //         {
    //             test: /\.ts$/,
    //             exclude: /node_modules/,
    //             use: [
    //                 {
    //                     loader: 'ts-loader'
    //                 },
    //                 // {
    //                 //     loader: 'babel-loader',
    //                 //     options: {
    //                 //         presets: ['@babel/preset-env'],
    //                 //         plugins: ['@babel/plugin-transform-modules-commonjs']
    //                 //     }
    //                 // }
    //             ]
    //         }
    //     ]
    // },
    entry: {
        'index': path.join(__dirname, '..', 'src-rules', 'rules.ts'),
    },
    output: {
        path: path.join(__dirname, '..', 'dist-rules'),
        filename: 'rules.bundle.js',
        "libraryTarget": "commonjs2"
    },
    devtool: 'source-map'
};