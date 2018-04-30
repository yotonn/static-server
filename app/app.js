let Koa = require('koa')
let KoaSend = require('koa-send')
let config = require('../config')
let FileReader = require('../libs/readFile.js')
let app = new Koa()


app.use(async (ctx, next) => {
    let html = await FileReader('index.html')
    for (const key in config) {
        if (config.hasOwnProperty(key)) {
            html = html.replace(key, config[key])
        }
    }
    await KoaSend(ctx, './index.html')
    let buf = Buffer.from(html)
    ctx.body = buf
})

module.exports = app