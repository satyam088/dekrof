const notFound = (req, res, next) => {
  res.status(404).render('notFound');
};
module.exports = notFound;