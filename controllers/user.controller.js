const express = require('express')
const User = require('../models/user.model')
const fs = require('fs')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const csrf = require('csurf');
const {check, validationResult} = require('express-validator')


class UserController {
    loginGet = (req, res) => {
        if(req.session.isAuth){
            return res.redirect('/')
        }
        res.render('login', { csrfToken: req.csrfToken(), err: '' })
    }

    loginPost = async (req, res) => {
        const {email, password} = req.body
        const result = validationResult(req)
        let err = ''
        
        if(result.errors.length > 0) {
            err =  result.errors[0].msg
            return res.render('login', { csrfToken: req.csrfToken(), err })
        }
        const userTemp = await User.find({email: email})

        if(userTemp.length != 0) {
            const hased = userTemp[0].password
            const match = bcrypt.compareSync( password, hased)
    
            if(match) {
                let user = JSON.parse(JSON.stringify(userTemp[0]))
                req.session.isAuth = userTemp[0]
                user.userRoot = `${req.vars.root}/users/${user.email}`
                req.session.user = user

                req.app.use(express.static(user.userRoot))

                return res.redirect('/')
            }  
        }
        err = 'Email hoac password khong chinh xac'
        res.render('login', { csrfToken: req.csrfToken(), err })

    }
    
    registerGet = (req, res) => {
        delete req.session.isAuth
        res.render('register', { csrfToken: req.csrfToken(), err: '' })
    }

    registerPost = (req, res) => {
        const {name, email, password, confirmPassword } = req.body
        const result = validationResult(req)

        if(result.errors.length > 0) {
            return res.render('register', { csrfToken: req.csrfToken(), err:  result.errors[0].msg })
        }

        const hased = bcrypt.hashSync(password, 10)
        const data = {name, email, password: hased}
        new User(data).save()

        const {root} = req.vars
        const userDir = `${root}/users/${email}`

        fs.mkdir(userDir, () => {
            res.redirect('/login')
        })
    }
}

module.exports = new UserController