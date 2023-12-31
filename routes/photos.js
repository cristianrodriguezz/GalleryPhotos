const { Router } = require('express')
const { uploadFile, getPhotosByUser, getRandomPhotos, getPhotosByUserName, likePhoto, getLikesPhotoByUserId, dislikePhoto, getCountLikePhotoById, getPhotosLikeByUser } = require('../controllers/photo')
const { validateGetPhotos, validateGetRandomPhotos, validateGetPhotosByUsername, validateLikePhoto, validateCountPhoto } = require('../validators/photos')
const { validateUploadPhoto } = require('../validators/uploadPhotos')

const router = Router()

router.post('/upload', validateUploadPhoto, uploadFile)

router.get('/getphotos', validateGetPhotos , getPhotosByUser)

router.get('/getRandomPhotos',validateGetRandomPhotos, getRandomPhotos)

router.get('/getPhotosByUserName',validateGetPhotosByUsername, getPhotosByUserName)

router.post('/like', likePhoto)

router.post('/dislike', dislikePhoto)

router.get('/likes', validateGetPhotos, getLikesPhotoByUserId)

router.get('/count', validateCountPhoto, getCountLikePhotoById)

router.get('/getPhotosLikeByUser', validateGetPhotosByUsername, getPhotosLikeByUser)



module.exports = router