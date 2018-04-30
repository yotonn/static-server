
let fs = require('fs')
let path = require('path')

const current_path = process.cwd()
const FileReader = file => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.resolve(current_path, file), (err, data) => {
            if (err !== null) reject(err)
            resolve(data.toString())
        })
    })
}

module.exports = FileReader