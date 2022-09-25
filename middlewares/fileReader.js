const fs = require('fs');
const Path = require('path');
const { fileTypes, fileIcons } = require('./supportFiles')

exports.load = (userRoot, location) => {
    return new Promise((resolve, reject) => {

        let files = fs.readdirSync(location)

        let result = []

        files.forEach(f => {
            let name = f
            let path = location + '/' + name

            if (location.endsWith('/')) {
                path = location + name
            }
            let ext = Path.extname(name)
            let stats = fs.statSync(path)
            let type = fileTypes[ext] || 'Other File'
            let icon = fileIcons[ext] || '<i class="fas fa-file"></i>'
            let subPath = path.replace(userRoot, '')

            let size = stats.size + 'bit'
            if (parseInt(size) >= 1024) {
                size = (parseInt(size) * 1.0 / 1024.0).toFixed(0)
                size = size + 'KB'
                if (parseInt(size) >= 1024) {
                    size = (parseInt(size) * 1.0 / 1024.0).toFixed(2)
                    size = size + 'MB'
                }
            }

            if (stats.isDirectory()) {
                if (subPath.startsWith('/')) {
                    subPath = `?dir=${subPath.substring(1)}`
                }
                else subPath = `?dir=${subPath}`
            }

            let pathTemp = location + '/'
            let loadPath = pathTemp.replace(userRoot, '')
            if (loadPath.startsWith('/')) {
                loadPath = loadPath.substring(1)
            }
            else loadPath = loadPath

            result.push({
                name: name,
                path: path,
                isDirectory: stats.isDirectory(),
                size: size,
                lastModified: stats.mtime,
                ext: ext,
                type: type,
                icon: icon,
                subPath: subPath,
                loadPath: loadPath,
            })


        })

        resolve(result)

    })
}

exports.loadOne = (userRoot, file) => {
    return new Promise((resolve, reject) => {

        let path = file
        let name = Path.basename(file)

        // if (location.endsWith('/')) {
        //     path = location + name
        // }
        let ext = Path.extname(path)

        let stats = fs.statSync(path)

        let type = fileTypes[ext] || 'Other File'

        let icon = fileIcons[ext] || '<i class="fas fa-file"></i>'
        let subPath = path.replace(userRoot, '')
        
        let size = stats.size + 'bit'
        if (parseInt(size) >= 1024) {
            size = (parseInt(size) * 1.0 / 1024.0).toFixed(0)
            size = size + 'KB'
            if (parseInt(size) >= 1024) {
                size = (parseInt(size) * 1.0 / 1024.0).toFixed(2)
                size = size + 'MB'
            }
        }

        if (stats.isDirectory()) {
            if (subPath.startsWith('/')) {
                subPath = `?dir=${subPath.substring(1)}`
            }
            else subPath = `?dir=${subPath}`
        }

        result = {
            name: name,
            path: path,
            isDirectory: stats.isDirectory(),
            size: size,
            lastModified: stats.mtime,
            ext: ext,
            type: type,
            icon: icon,
            subPath: subPath,
        }



        resolve(result)

    })
}