const express = require('express');
const router = express.Router()
const fileController = require('../controllers/file.controller');
const checkLogin = require('../middlewares/checkLogin')
const fs = require('fs')
const getCurrentDir = require('../middlewares/getCurrentDir');
const { route } = require('./user.router');
const multer = require('multer')
const Path = require('path');
const AdmZip = require('adm-zip');
const uploader = multer({ dest: Path.join(__dirname, '..', '/uploads') })

router.get('/', checkLogin, getCurrentDir, fileController.home)

router.post('/upload', checkLogin, uploader.single('attachment'), fileController.upload)

router.post('/rename/:oldName', checkLogin, fileController.rename)

router.delete('/delete/:name', checkLogin, fileController.delete)

router.post('/new-folder/:name', checkLogin, fileController.newFolder)

router.post('/new-file/:name', checkLogin, fileController.newFile)

router.post('/download/:name', checkLogin, fileController.download)

router.get('/download/:path', checkLogin, (req, res) => {
    let path = req.params.path
    let stats = fs.statSync(path)
    if (stats.isDirectory()) {
        let uploadDir = fs.readdirSync(path);
        let temArray = path.split('/')
        let nameFolder = temArray.pop()
        const zip = new AdmZip();
        for (let i = 0; i < uploadDir.length; i++) {
            zip.addLocalFile(path + '/' + uploadDir[i]);
        }
        const downloadName = `${nameFolder}.zip`;
        const data = zip.toBuffer();
        // save file zip in root directory
        // zip.writeZip(__dirname + "/" + downloadName);
        res.set('Content-Type', 'application/octet-stream');
        res.set('Content-Disposition', `attachment; filename=${downloadName}`);
        res.set('Content-Length', data.length);
        res.send(data);
    }
    res.download(path)
})

module.exports = router