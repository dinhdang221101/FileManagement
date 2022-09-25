const fs = require('fs')

module.exports = (req, res, next) =>{
    const {userRoot} = req.session.user
    let {dir} = req.query

    if(dir === undefined ) dir = ''

    let currentDir = `${userRoot}/${dir}`

    if(!fs.existsSync(currentDir)){
        currentDir = userRoot
    }

    req.vars.currentDir = currentDir
    req.vars.userRoot = userRoot
    
    next()
}