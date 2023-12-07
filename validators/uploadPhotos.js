const { query } = require('express-validator');

const validateUploadPhoto = [
  query('userId').isInt().withMessage('UserId must be a valid integer.')
]

module.exports = { validateUploadPhoto }