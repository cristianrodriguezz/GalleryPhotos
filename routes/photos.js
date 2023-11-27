const { Router } = require('express')
const { uploadFile, getPhotos } = require('../controllers/s3')
const { validateGetPhotos } = require('../validators/getphotos')

const router = Router()

router.post('/upload', uploadFile)

router.get('/getphotos', validateGetPhotos , getPhotos)



module.exports = router