const jwt = require("jsonwebtoken");
const { TokenExpiredError } = jwt;

const catchError = (err, res) => { 
    if (err instanceof TokenExpiredError) {
      return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
    }
  
    return res.status(401).send({ message: "Unauthorized!" });
  }

module.exports = (req, res, next) => {

    // const refreshToken = req.cookies['refreshToken'];
    const accessToken = req.headers.authorization.split(" ")[1]; // Bearer sfdsfstoken

    if (!accessToken) { // || !refreshToken
      return res.status(403).json({message: "Unauthorized - No acccess token provided."});
    }

    jwt.verify(accessToken, process.env.JWT_PRIVATE_KEY, (err, decoded) => {
      if (err) {
        return catchError(err, res); //return res.sendStatus(401).send({ message: "Unauthorized!" });
      }
      console.log("Verify: ", decoded);
      req.userId = decoded.id; // TODO, necesario?
      next();
    });
  }