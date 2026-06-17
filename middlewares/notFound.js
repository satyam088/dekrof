const notFound = (req, res, next) => {
  console.log( req.method, req.originalUrl);
  res.status(404).send("404 not found");
};
module.exports = notFound;