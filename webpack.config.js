const path = require('path');

const lambdas = {
    API_Tests_Create: './src/lambda/functions/API_Tests_Create',
};

module.exports = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    target: 'node',
    stats: 'minimal',
    entry: lambdas,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]/index.js',
        libraryTarget: 'umd',
    },
    externals: {
        'aws-sdk': 'aws-sdk',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },
        ],
    },
};
