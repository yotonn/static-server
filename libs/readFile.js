
let fs = require('fs')

const FileReader = file_path => {
    return new Promise((resolve, reject) => {
        fs.readFile(file_path, (err, data) => {
            if (err !== null) reject(err)
            resolve(data)
        })
    })
}

module.exports = FileReader