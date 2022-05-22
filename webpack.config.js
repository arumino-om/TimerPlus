const path = require('path');
module.exports = {
    // mode: 'development',
    mode: 'production',

    entry: './src/app/main.ts',

    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js'
    },

    resolve: {
        extensions:['.ts','.js']
    },

    module: {
        rules: [
            {
                test:/\.ts$/,loader:'ts-loader'
            }
        ]
    },

    devServer: {
        static: {
            directory: path.join(__dirname, 'public')
        },
        compress: false,
        port: 8080,
        open: false,
    },
}
