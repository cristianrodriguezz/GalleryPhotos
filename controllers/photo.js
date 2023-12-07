const dotenv = require('dotenv').config()
const { PutObjectCommand} = require('@aws-sdk/client-s3')
const fs = require('fs')
const pool = require('../config/db')
const { s3Client } = require('../config/aws3')
const { validationResult } = require('express-validator')
const { validateLikePhoto } = require('../validators/photos')


const AWS_BUCKET_NAME=process.env.AWS_BUCKET_NAME


async function uploadFile (req, res) {

  const errors = validationResult(req)

  if(!errors.isEmpty()) return res.send({error: errors.array()})

  const { userId } = req.query

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
    values: [linkFinal, userId]
  }

  try {

    await client.query('BEGIN')

    const { rows } = await pool.query(query)

    const response = await s3Client.send(command);

    await client.query('COMMIT')

    res.send(response)

  } catch (err) {

    await client.query('ROLLBACK')

    res.status(400).send({error: err})
  } finally {

    client.release()

  }
}

const getPhotosByUser = async (req , res) => {

  const errors = validationResult(req)

  if(!errors.isEmpty()) return res.send({error: errors.array()})
  
  console.log('Conexiones totales en la pool:', pool.totalCount);
console.log('Conexiones inactivas en la pool:', pool.idleCount);

  const { userId } = req.query

  const client = await pool.connect()

  const queryGetPhotos = {
    text: `SELECT 
    p.id AS id,
    p.link AS link,
    u.id AS user_id,
    u.name,
    u.lastname
    FROM 
    public."Photos" p
    JOIN 
    public."Users" u ON p.user_id = u.id
	  where u.id = $1
  `,
    values: [userId]
  }



  try {
    const response = await client.query(queryGetPhotos)

    res.send( response.rows )
    
  } catch (error) {
    res.status(400).send(error)

  } finally {

    client.release()

  }

}

const getRandomPhotos = async (req, res) => {

  const errors = validationResult(req)

  if(!errors.isEmpty()) return res.send({error: errors.array()})

  const { page, limit } = req.query

  const client = await pool.connect()

  const query = {
    text: `SELECT * FROM paginated_random_photos($1, $2)`,
    values: [page, limit]
  }
  try {
    const response = await pool.query(query)

    const result = response.rows


    res.send(result)
  } catch (error) {
    res.status(400).send({error: error})
  } finally {

    client.release()

  }
  
}
const getPhotosByUserName = async (req , res) => {

  const errors = validationResult(req)

  if(!errors.isEmpty()) return res.send({error: errors.array()})
  
  const { username } = req.query

  const client = await pool.connect()

  const queryGetPhotos = {
    text: `SELECT 
    p.id AS id,
    p.link AS link,
    u.id AS user_id,
    u.name,
    u.lastname,
    u.username
    FROM 
    public."Photos" p
    JOIN 
    public."Users" u ON p.user_id = u.id
    where u.username = $1`,
    values: [username]
  }



  try {
    const response = await client.query(queryGetPhotos)

    res.send( response.rows )
    
  } catch (error) {
    res.status(400).send(error)

  } finally {

    client.release()

  }

}

const likePhoto = async (req , res) => {

  const result = validateLikePhoto(req.body)

  if(result.error) return res.status(400).send({ error: result.error.issues })

  const { userId , photoId } = result.data

  const client = await pool.connect()
  
  const queryValidateLike = {
    text: `SELECT id, user_id, photo_id
    FROM public."LikesPhotos"
    where user_id = $1 and photo_id = $2`,
    values: [userId, photoId]
  }

  const queryLikePhoto = {
    text: `INSERT INTO public."LikesPhotos"
    (user_id, photo_id)
    overriding system value
    VALUES ($1, $2)
    returning *`,
    values: [userId, photoId]
  }

  try {

    await client.query('BEGIN')

    const responseValidateLikePhoto = await client.query(queryValidateLike)

    if(responseValidateLikePhoto.rowCount !== 0 ) return res.status(409).send({Error:'You have already liked the photo.' })
    
    const responseLikePhoto = await client.query(queryLikePhoto)

    res.send( responseLikePhoto.rows )

    await client.query('COMMIT')

  } catch (error) {

    res.status(400).send({Error: error.message})
    
    await client.query('ROLLBACK')
    
  } finally {

    client.release()

  }

}

const dislikePhoto = async (req , res) => {

  const result = validateLikePhoto(req.body)

  if(result.error) return res.status(400).send({ error: result.error.issues })

  const { userId , photoId } = result.data

  const client = await pool.connect()
  
  const queryValidateLike = {
    text: `SELECT id, user_id, photo_id
    FROM public."LikesPhotos"
    where user_id = $1 and photo_id = $2`,
    values: [userId, photoId]
  }

  const queryDislikePhoto = {
    text: `DELETE FROM public."LikesPhotos"
    WHERE user_id = $1 and photo_id = $2;`,
    values: [userId, photoId]
  }

  try {

    await client.query('BEGIN')

    const responseValidateLikePhoto = await client.query(queryValidateLike)

    if(responseValidateLikePhoto.rowCount === 0 ) return res.status(409).send({Error:'You have not liked the photo yet.'})
    
    await client.query(queryDislikePhoto)

    res.send( 'Successfully deleted' )

    await client.query('COMMIT')

  } catch (error) {

    res.status(400).send({Error: error.message})
    
    await client.query('ROLLBACK')
    
  } finally {

    client.release()

  }

}

const getLikesPhotoByUserId = async (req , res) => {

  const errors = validationResult(req)

  if(!errors.isEmpty()) return res.send({error: errors.array()})
  
  const { userId } = req.query

  const client = await pool.connect()
  
  const query = {
    text: `SELECT id, user_id, photo_id
    FROM public."LikesPhotos"
    where user_id = $1`,
    values: [userId]
  }

  try {

    const response = await client.query(query)

    res.send( response.rows )


  } catch (error) {

    res.status(400).send({Error: error.message})
    
    
  } finally{

    client.release()

  }

}





module.exports = { uploadFile, getPhotosByUser, getRandomPhotos, getPhotosByUserName, likePhoto, dislikePhoto, getLikesPhotoByUserId}

