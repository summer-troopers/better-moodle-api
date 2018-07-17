
module.exports = function chat(req, res, next) {
  res.sendFile(`${__dirname}/index.html`);
};
