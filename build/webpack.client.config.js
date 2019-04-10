const path = require('path')
const clientConfig = {
    mode: 'development',
    entry: './entry-client.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'js/[name].[chunkhash].js'
    }
}
module.exports = clientConfig
