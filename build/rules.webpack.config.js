const path = require('path');
const shared = require('./shared.adobe.webpack.config');

module.exports = {
    ...shared,
    target: 'node',
    entry: {
        'index': path.join(__dirname, '..', 'src-rules', 'rules.js'),
    },
    output: {
        path: path.join(__dirname, '..', 'dist-rules'),
        filename: '[name].bundle.js'
    },
};