const pool = require('../config/db');
const allowedRoutes = require('./allowedRoutes');
const { handleHttpError } = require('../utils/handleError')
const { verifyToken } = require('../utils/handleJwt')

const authMiddleware = async (req, res, next) => {

  const path = req.originalUrl
  console.log(path);

  if (allowedRoutes.includes(path.split('?')[0])) return next();
  
  const client = await pool.connect()
  try {

    if (!req.headers.authorization) {
      res.status(401).send('NEED_SESSION')
      return
    }

    const token = req.headers.authorization.split(' ').pop()
    const dataToken = await verifyToken(token)

    if (!dataToken) {
      res.status(401).send('NOT_PAYLOAD_DATA')
      return
    }

    const query = {
      text: `SELECT *
      FROM public."Users"
      where id = $1`,
      values: [dataToken.id]
    }

    const response = await client.query(query)

    const user = response.rows[0]

    req.user = user
    next()
  } catch (e) {

    res.status(401).send('NOT_SESSION')

  } finally{
    client.release()
  }
}

module.exports = authMiddleware