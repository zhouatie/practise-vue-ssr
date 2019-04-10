const path = require('path')
serverConfig = {
    entry: './entry-server.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'js/[name].[chunkhash].js'
    }
}

module.exports = serverConfig