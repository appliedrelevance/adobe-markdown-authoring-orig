const path = require('path');
const shared = require('./shared.webpack.config');

module.exports = {
    ...shared,
    target: 'node',
    entry: {
        'index': path.join(__dirname, '..', 'src-plugin', 'index.ts'),
    },
    output: {
        path: path.join(__dirname, '..', 'dist-plugin'),
        filename: '[name].bundle.js'
    },
};