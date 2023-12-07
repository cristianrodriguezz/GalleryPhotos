const { z } = require("zod")

const userRegisterSchema = z.object({
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  })
    .min(3, { message: 'Must be 3 or more characters long' })
    .max(40, { message: 'Must be 30 or fewer characters long' }),
  lastname: z.string({
    required_error: 'Last name is required',
    invalid_type_error: 'Last name must be a string',
  })
    .max(40, { message: 'Must be 40 or fewer characters long' }),
  username: z.string({
      required_error: 'Last name is required',
      invalid_type_error: 'Last name must be a string',
    })
      .max(50, { message: 'Must be 40 or fewer characters long' }),
  email: z.string({
    required_error: 'Email is required',
    invalid_type_error: 'Email must be a string',
  })
    .email({ message: 'Invalid email address' })
    .min(5, { message: 'Must be 5 or more characters long' })
    .max(40, { message: 'Must be 5 or fewer characters long' }),
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  })    
    .min(5, { message: 'Must be 5 or more characters long' })
    .max(40, { message: 'Must be 40 or fewer characters long' }),
})

const userLoginSchema = z.object({
  email: z.string({
    required_error: 'Email is required',
    invalid_type_error: 'Email must be a string',
  })
    .email({ message: 'Invalid email address' })
    .min(5, { message: 'Must be 5 or more characters long' })
    .max(40, { message: 'Must be 5 or fewer characters long' }),
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  })
})


function validateRegister (object) {
  return userRegisterSchema.safeParse(object)
}
function validateLogin (object) {
  return userLoginSchema.safeParse(object)
}

module.exports = {validateRegister, validateLogin}