const mongoose = require('mongoose')
const fileReader = require('../middlewares/fileReader')
const fs = require('fs')
const express = require('express')
const Path = require('path');

class FileController {
    home = (req, res) => {
        let { userRoot, currentDir } = req.vars
        let path = req.query.dir
        if (path === undefined) {
            path = '/'
        } else { path = path + '/' }
        fileReader.load(userRoot, currentDir)
            .then(files => {
                // if(files.length === 0)
                res.render('index', { user: req.session.isAuth, files, path })
            })
    }

    upload = (req, res) => {
        const email = req.body.email
        const path = req.body.path
        const file = req.file
        
        if (!email || !path || !file) {
            return res.json({ code: 1, message: 'Thong tin khong hop le', data: { email, path, file } })
        }

        const { root } = req.vars
        const currentPath = `${root}/users/${email}/${path}`

        if (!fs.existsSync(currentPath)) {
            return res.json({ code: 2, message: 'Duong dan khong ton tai' })
        }

        let name = file.originalname
        let newPath = currentPath + '/' + name

        fs.renameSync(file.path, newPath)
        let userRoot = `${root}/users/${email}`
        fileReader.loadOne(userRoot, newPath)
            .then(file => {
                return res.json({ code: 0, message: 'Upload thanh cong', data: file })

            })
    }

    rename = (req, res) => {
        let { oldName } = req.params

        let { newName, email, path } = req.body
        // console.log(path);
        const { root } = req.vars
        const currentPath = `${root}/users/${email}/${path}${oldName}`
        const newPath = `${root}/users/${email}/${path}${newName}`
        // console.log(currentPath, newPath);
        if (!email || !path || !oldName || !newName) {
            return res.json({ code: 1, message: 'Thong tin khong hop le' })
        }

        if (!fs.existsSync(currentPath)) {
            return res.json({ code: 2, message: 'Duong dan khong ton tai' })
        }

        fs.renameSync(currentPath, newPath, { recursive: true })

        return res.json({ code: 0, message: 'Rename thanh cong' })
    }

    delete = (req, res) => {
        let { name } = req.params
        let { email, path } = req.body

        const { root } = req.vars
        const currentPath = `${root}/users/${email}/${path}${name}`

        let stats = fs.statSync(currentPath)

        if (!email || !path) {
            return res.json({ code: 1, message: 'Thong tin khong hop le' })
        }

        if (!fs.existsSync(currentPath)) {
            return res.json({ code: 2, message: 'File khong ton tai' })
        }


        if (stats.isDirectory()) {
            fs.rmSync(currentPath, { recursive: true })
        } else {
            fs.unlinkSync(currentPath)
        }

        return res.json({ code: 0, message: 'Xoa file thanh cong' })
    }

    newFolder = (req, res) => {
        let { name } = req.params
        let { email, path } = req.body

        const { root } = req.vars
        const folderPath = `${root}/users/${email}/${path}${name}`



        if (!email || !path) {
            return res.json({ code: 1, message: 'Thong tin khong hop le' })
        }

        if (fs.existsSync(folderPath)) {
            return res.json({ code: 2, message: 'Thu muc da ton tai' })
        }

        fs.mkdirSync(folderPath)

        let userRoot = `${root}/users/${email}`
        fileReader.loadOne(userRoot, folderPath)
            .then(file => {
                return res.json({ code: 0, message: 'Tao thu muc thanh cong', data: file })
            })
    }

    newFile = (req, res) => {
        let { name } = req.params
        let { email, path, content } = req.body

        const { root } = req.vars
        const filePath = `${root}/users/${email}/${path}${name}.txt`



        if (!email || !path || !content) {
            return res.json({ code: 1, message: 'Thong tin khong hop le' })
        }

        if (fs.existsSync(filePath)) {
            return res.json({ code: 2, message: 'Tap tin da ton tai' })
        }

        fs.writeFileSync(filePath, content)

        let userRoot = `${root}/users/${email}`
        fileReader.loadOne(userRoot, filePath)
            .then(file => {
                return res.json({ code: 0, message: 'Tao tap tin thanh cong', data: file })
            })
    }

    download = async (req, res) => {
        let { name } = req.params
        let { email, path } = req.body

        const { root } = req.vars
        const filePath = `${root}/users/${email}/${path}${name}`

        if (!email || !path) {
            return res.json({ code: 1, message: 'Thong tin khong hop le' })
        }

        return res.json({ code: 0, message: 'ok', data: filePath })
    }
}

module.exports = new FileController