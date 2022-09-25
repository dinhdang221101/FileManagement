const {check, validationResult} = require('express-validator')

exports.validatorLogin = [
    check('email').notEmpty().withMessage('Vui long nhap email')
    .isEmail().withMessage('Email khong dung dinh dang'),

    check('password').notEmpty().withMessage('Vui long nhap password')
    .isLength({min: 6}).withMessage('Password phai tu 6 ky tu tro len'),
]

exports.validatorRegister  = [
    check('name').notEmpty().withMessage('Vui long nhap ten'),
    
    check('email').notEmpty().withMessage('Vui long nhap email')
    .isEmail().withMessage('Email khong dung dinh dang'),

    check('password').notEmpty().withMessage('Vui long nhap password')
    .isLength({min: 6}).withMessage('Password phai tu 6 ky tu tro len'),

    check('confirmPassword').notEmpty().withMessage('Vui long nhap password confirm')
    .custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Mat khau khong trung khop')
        }
        return true;
    })
]
