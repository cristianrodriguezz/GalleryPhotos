const express = require('express')
const fileUpload = require('express-fileupload')
const photosRoutes = require('./routes/photos')
const cors = require('cors')
const corsMiddleware = require('./middleware/corsMiddleware')

const app = express()

app.use(corsMiddleware())

const port = 3000

app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : './uploads'
}));

app.use(photosRoutes)

app.listen(port)

console.log(`Server on ${port}`)