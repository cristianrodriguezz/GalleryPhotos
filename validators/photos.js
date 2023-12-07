const { query } = require('express-validator');
const { z } = require('zod');

const validateGetPhotos = [
  query('userId').isInt().withMessage('UserId must be a valid integer.')
]
const validateGetPhotosByUsername = [
  query('username').isString().withMessage('Debe ser una cadena'),
]

const validateGetRandomPhotos = [
  query('page').isInt().withMessage('page must be a valid integer.'),
  query('limit').isInt().withMessage('limit must be a valid integer.')
]

const validateCountPhoto = [
  query('photoId').isInt().withMessage('photoId must be a valid integer.'),
]


const likePhoto = z.object({
  userId: z.number({
    required_error: 'userId is required',
    invalid_type_error: 'userId must be a integer',
  }),
  photoId: z.number({
    required_error: 'photoId is required',
    invalid_type_error: 'photoId must be a integer',
  })
})


function validateLikePhoto (object) {
  return likePhoto.safeParse(object)
}



module.exports = { validateGetPhotos , validateGetRandomPhotos, validateGetPhotosByUsername, validateLikePhoto, validateCountPhoto}