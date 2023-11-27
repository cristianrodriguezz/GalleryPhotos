const dotenv = require('dotenv').config()
const { PutObjectCommand, GetObjectCommand} = require('@aws-sdk/client-s3')
const  { getSignedUrl } =  require("@aws-sdk/s3-request-presigner")
const fs = require('fs')
const pool = require('../config/db')
const { s3Client } = require('../config/aws3')
const { validationResult } = require('express-validator')


const AWS_BUCKET_NAME=process.env.AWS_BUCKET_NAME


async function uploadFile (req, res) {
  console.log(req.files['photo'].tempFilePath);
  const stream = fs.createReadStream(req.files['photo'].tempFilePath)

  const command = new PutObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: req.files['photo'].name,
      Body: stream
    })

  const client = await pool.connect()

  let nameFile = req.files['photo'].name.split(' ').join('+')

  const link = 'https://socialred.s3.sa-east-1.amazonaws.com/'

  const linkFinal = link + nameFile

  const query = {
    text: `INSERT INTO public."Photos"(
      link, user_id )
      overriding system value
      VALUES ( $1, $2 ) returning id` ,
    values: [linkFinal, 2]
  }

  try {

    await client.query('BEGIN')

    const { rows } = await pool.query(query)

    const response = await s3Client.send(command);

    await client.query('COMMIT')

    res.send(response)

  } catch (err) {

    await client.query('ROLLBACK')

    res.send({error: err})
  }
}

const getPhotos = async (req , res) => {

  const errors = validationResult(req)

  if(!errors.isEmpty()) return res.send({error: errors.array()})

  const { userId } = req.query

  const queryGetPhotos = {
    text: `SELECT id, link, user_id
    FROM public."Photos"
    where user_id = $1`,
    values: [userId]
  }
  const client = await pool.connect()

  try {
    const response = await client.query(queryGetPhotos)

    res.send( response.rows )
    
  } catch (error) {
    res.send(error)
  }

}



module.exports = { uploadFile, getPhotos }

