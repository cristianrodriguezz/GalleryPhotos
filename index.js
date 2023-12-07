const express = require('express')
const fileUpload = require('express-fileupload')
const photosRoutes = require('./routes/photos')
const authRoutes = require('./routes/auth')
const cors = require('cors')
const corsMiddleware = require('./middleware/corsMiddleware')
const authMiddleware = require('./middleware/authMiddleware')

const app = express()

app.use(express.json());
app.use(corsMiddleware())
// app.use(authMiddleware)

const port = 3000

app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : './uploads'
}));

app.use('/api', require('./routes'))

app.listen(port)

console.log(`Server on ${port}`)