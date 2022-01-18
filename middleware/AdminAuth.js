var jwt = require("jsonwebtoken");
var secret = "definindoUmSecret123";

module.exports = function (req, res, next) {

  const authToken = req.headers['authorization']

  if (authToken != undefined) {

    const bearer = authToken.split(' ');
    var token = bearer[1];

    try {
      var decoded = jwt.verify(token, secret);

      if (decoded.role == 1) {
        next();
      } else {
        res.status(403);
        res.send("Você não está autorizado!");
        return;
      }


    } catch (error) {
      console.log(error);
      res.status(403);
      res.send("Você não está autenticado2!");
      return;
    }

  } else {
    res.status(403);
    res.send("Você não está autenticado1!");
    return;
  }

}