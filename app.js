const Vue = require('vue');

module.exports = function createApp(context) {
    const app = new Vue({
        template: `<div>${context.url}</div>`
    })
    return { app }
}