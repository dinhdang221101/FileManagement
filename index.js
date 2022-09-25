require('dotenv').config();
const express = require('express')
const fs = require('fs')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const db = require('./db')
const userRouter = require('./routes/user.router')
const fileRouter = require('./routes/file.router')


const app = express()

app.set("views", (__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser('ddd'))
app.use(session({
    secret: 'td',
    resave: false,
    saveUninitialized: false
}))

app.use((req, res, next) => {
    req.vars = {root: __dirname}
    next()
})

app.use('/', userRouter)

app.use('/', fileRouter)

app.use(async (req, res, next) => {
    const path = req.path.toLowerCase()

    if(fs.existsSync(__dirname + '/views' + path + '.ejs')) {
        return res.render(path.replace(/^\//, ''))
    }
    next()
})

// app.use((req, res) => {
//     res.status(404)
//     res.render('error')
// })

app.use((err, req, res, next) => {
    console.error(err.message)
    res.type('text/plain')
    res.status(500)
    res.send('500 - Server Error')
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log("Server is runing at http://localhost:" + port);
})