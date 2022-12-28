
const path = require('path');

module.exports = {
    target: 'web',
    entry: {
        'index': path.join(__dirname, '..', 'src', 'preview', 'index.ts'),
    },
    output: {
        path: path.join(__dirname, '..', 'out', 'preview'),
        filename: '[name].bundle.js'
    },
};