const path = require('path');

module.exports = {
    entry: './client/main.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [{
                    loader: 'awesome-typescript-loader',
                    options: {
                        configFileName: './client/tsconfig.json'
                    }
                }],
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        libraryTarget: 'umd',
        filename: 'main.js',
        path: path.resolve(__dirname, '..', 'dist')
    }
};