const path = require('path');
const shared = require('./shared.adobe.webpack.config');

module.exports = {
    ...shared,
    target: 'web',
    entry: {
        'index': path.join(__dirname, '..', 'src-rules', 'rules.ts'),
    },
    output: {
        path: path.join(__dirname, '..', 'dist-rules'),
        filename: 'rules.bundle.js'
    },
    devtool: 'source-map'
};