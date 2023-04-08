resBuilder = async (res, status, data, message) => {
  let statusCode,success
  switch (status) {
    case "error":
      statusCode = 500
      success = failed
      break;
    case "NotFound":
      statusCode = 404
    default:
      break;
  }
  res.status(statusCode).send({ success, data, message });
};

module.exports = resBuilder;
