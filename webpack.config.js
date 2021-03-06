const path = require('path');

const lambdas = {
    API_Audits_Create: './src/lambda/API_Audits_Create',
    API_Audits_Index: './src/lambda/API_Audits_Index',
    API_Audits_Show: './src/lambda/API_Audits_Show',
    API_RunPageSpeed: './src/lambda/API_RunPageSpeed',
    Stream_Audits_Delete: './src/lambda/Stream_Audits_Delete',
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
