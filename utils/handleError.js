const handleHttpError = async (res, message = 'Something Happened', code = 403) => {
  res.status(code)
  res.send({ error: message })
}


module.exports = { handleHttpError }
