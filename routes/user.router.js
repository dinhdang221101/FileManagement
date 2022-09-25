const express = require('express');
const router = express.Router()
const userController = require('../controllers/user.controller');
const csrf = require('csurf');
const validator = require('../middlewares/validator')

const csrfProtect = csrf({ cookie: true })

// router.use(csrfProtect)

router.get('/login', csrfProtect, userController.loginGet)

router.post('/login', validator.validatorLogin, csrfProtect, userController.loginPost)

router.get('/register', csrfProtect, userController.registerGet)

router.post('/register', validator.validatorRegister, csrfProtect, userController.registerPost)

module.exports = router