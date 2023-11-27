const { query } = require('express-validator');

const validateGetPhotos = [
  query('userId').isInt().withMessage('UserId must be a valid integer.')
]

module.exports = { validateGetPhotos }