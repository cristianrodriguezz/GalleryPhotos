const cors = require('cors')

const ACCPETED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:5173',
  'http://localhost:5174',
]

const corsMiddleware = ({ acceptedOrigins = ACCPETED_ORIGINS} = {} ) => cors({
  origin: (origin, callback) => {
    if(acceptedOrigins.includes(origin)) {
      return callback(null, true)
    }
    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
})

module.exports = corsMiddleware