module.exports.sendResponse = async (statusCode,body, res) => {
    return res.status(statusCode).send(body)
  };
  