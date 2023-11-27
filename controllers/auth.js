const { encrypt } = require("../utils/handlePassword")
const { validateRegister } = require("../validators/user")


const register = async (req, res) => {
  const result = validateRegister(req.body)

  if(result.error) return res.status(400).send({ error: result.error.issues })

  const { name, lastname, email, password } = result.data

  const encryptPw = await encrypt(password)

  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const queryRegister = {
      text: ``,
      values: []
    }

    const response = await client.query(query)

    console.log(response.rows[0])
    
    await client.query('COMMIT')

  } catch (error) {

    await client.query('ROLLBACK')

    res.status(409).json({ error: 'Email already exists' })

    
  }finally{
    client.release()
  }
}