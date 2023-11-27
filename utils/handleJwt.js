const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const JWT_SECRET_RESET_PASSWORD = process.env.JWT_SECRET_RESET_PASSWORD
const JWT_SECRET_VALIDATE_USER = process.env.JWT_SECRET_VALIDATE_USER


const tokenSign = async (user) => {
  const sign = jwt.sign(
    {
      id: user.id
    },
    JWT_SECRET,
    {
      expiresIn: '2h'
    }
  )

  return sign
}

const tokenResetPasswordSign = async (email) => {
  const sign = jwt.sign(
    {
      email
    },
    JWT_SECRET_RESET_PASSWORD,
    {
      expiresIn: '1h'
    }
  )
  return sign
}
const tokenValidateUser = async (email) => {
  const sign = jwt.sign(
    {
      email
    },
    JWT_SECRET_VALIDATE_USER,
    {
      expiresIn: '0.09h'
    }
  )
  return sign
}

const verifyToken = async (tokenJwt) => {
  try {
    return jwt.verify(tokenJwt, JWT_SECRET)
  } catch (e) {
    return null
  }
}

const verifyResetPasswordToken = async (token) => {
  try {
    return jwt.verify(token, JWT_SECRET_RESET_PASSWORD)
  } catch (e) {
    return null
  }
}
const verifyValidateUserToken = async (token) => {
  try {
    return jwt.verify(token, JWT_SECRET_VALIDATE_USER)
  } catch (e) {
    return null
  }
}

module.exports = { tokenSign, verifyToken, tokenResetPasswordSign, verifyResetPasswordToken , verifyValidateUserToken, tokenValidateUser}
