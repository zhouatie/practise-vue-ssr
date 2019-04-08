const server = require('express')()
const Vue = require('vue');
const renderer = require('vue-server-renderer').createRenderer({
    template: require('fs').readFileSync('./index.template.html', 'utf-8')
});
server.get('*', (req, res) => {
    const context = {
        url: req.url
    }
    const app = new Vue({
        template: `<div>${context.url}</div>`
    })
    renderer.renderToString(app, (err, html) => {
        if (err) {
            res.status(500).end('Internal Server Error')
            return
        }
        res.end(html)
    })
})

server.listen(8080)