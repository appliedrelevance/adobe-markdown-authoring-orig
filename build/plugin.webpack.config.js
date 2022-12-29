
const path = require('path');
const shared = require('./shared.adobe.webpack.config');

module.exports = {
    ...shared,
    target: 'node',
    entry: {
        'index': path.join(__dirname, '..', 'src', 'plugin', 'index.ts'),
    },
    output: {
        path: path.join(__dirname, '..', 'out', 'plugin'),
        filename: '[name].bundle.js'
    },
};