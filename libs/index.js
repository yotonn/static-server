const Koa = require('koa')
const path = require('path')
const config = require('../config')
const FileReader = require('../libs/readFile.js')
const KoaSend = require('./koa-send')
const escapeStringRegexp = require('escape-string-regexp')
const FileTypeReg = /\.(js|css|html)$/i

const App = class {
    constructor() {
        this.checkConfig()
        this.App = new Koa()
        this.App.use(this.Controller)
        this.App.use(this.FileReader)

    }
    checkConfig() {
        if (typeof config !== 'object' || Array.isArray(config)) {
            throw new Error('config data is not a object')
            process.exit(0)
        }
        let keys = Object.keys(config)
        let _keys = new Set(keys)
        if (keys.length !== _keys.size) {
            throw new Error('config data must be norepeat')
            process.exit(0)
        }
    }
    async Controller(ctx, next) {
        let method = ctx.method
        if (method !== 'GET') {
            ctx.body = ' The request methods isn\'t get'
            return
        }

        if (ctx.url === '/') {
            ctx.url = '/index.html'
        }

        await next()
    }

    async FileReader(ctx, next) {
        let path = await KoaSend(ctx, ctx.url, { root: process.cwd() })

        if (!FileTypeReg.test(path)) {
            ctx.body = fs.createReadStream(path)
            await next()
            return
        }
        try {
            let file_buf = await FileReader(path)
            let file_str = file_buf.toString()
            for (const key in config) {
                if (config.hasOwnProperty(key)) {
                    const reg = new RegExp(escapeStringRegexp(key), 'gmi')
                    file_str = file_str.replace(reg, config[key])
                }
            }
            let buf = Buffer.from(file_str)
            ctx.set('Content-Length', buf.size)
            ctx.body = buf
        } catch (error) {
            ctx.body = error.message
            return
        }
    }
}

module.exports = App
