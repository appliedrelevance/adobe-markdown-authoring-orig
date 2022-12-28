
const path = require('path');
const shared = require('./shared.adobe.webpack.config');

module.exports = {
    ...shared,
    target: 'web',
    entry: {
        'index': path.join(__dirname, '..', 'src', 'plugin', 'index.ts'),
    },
    output: {
        path: path.join(__dirname, '..', 'out', 'preview'),
        filename: '[name].bundle.js'
    },
};