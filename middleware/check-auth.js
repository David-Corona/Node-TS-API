const jwt = require("jsonwebtoken");
const { TokenExpiredError } = jwt;

const catchError = (err, res) => { 
    // TODO - no se ejectura cuando ha expirado y eliminado de la bbdd, front vuelve a hacer request refresh, y llega hasta el enpoint en vez de saltar este error
    if (err instanceof TokenExpiredError) {
      return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
    }
  
    return res.sendStatus(401).send({ message: "Unauthorized!" });
  }

module.exports = (req, res, next) => {
    const token = req.cookies['refreshToken'];
    console.log("TOKEN", token);
    if (!token) {
      return res.status(403).json({message: "Unauthorized - No token provided."});
    }

    jwt.verify(token, process.env.JWT_PRIVATE_KEY, (err, decoded) => {
      if (err) {
        return catchError(err, res);
      }
      console.log("Verify: ", err, decoded);
      req.userId = decoded.id;
      next();
    });


    // jwt.verify(token, process.env.JWT_PRIVATE_KEY)
    //     .then( resp => {
    //         req.userData = {email: resp.email, userId: resp.userId};
    //         console.log("Decoded - ", req.userData);
    //         next();
    //     })
    //     .catch( e => {
    //         console.log(" Invalid token - ", e);
    //         res.status(401).json({
    //             message: "Unauthorized - Invalid token.",
    //             error: e
    //         });
    //     });




    // try {
    //     const decodedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    //     req.userData = {email: decodedToken.email, userId: decodedToken.userId};
    //     console.log("Decoded - ", req.userData);
    //     next();
    // } catch (e) {
    //     console.log(" Invalid token - ", e);
    //     res.status(401).json({
    //         message: "Unauthorized - Invalid token.",
    //         error: e
    //     });
    // }
}

// https://medium.com/@techsuneel99/jwt-authentication-in-nodejs-refresh-jwt-with-cookie-based-token-37348ff685bf

// const authenticate = (req, res, next) => {
//     const accessToken = req.headers['authorization'];
//     const refreshToken = req.cookies['refreshToken'];
  
//     if (!accessToken && !refreshToken) {
//       return res.status(401).send('Access Denied. No token provided.');
//     }
  
//     try {
//       const decoded = jwt.verify(accessToken, secretKey);
//       req.user = decoded.user;
//       next();
//     } catch (error) {
//       if (!refreshToken) {
//         return res.status(401).send('Access Denied. No refresh token provided.');
//       }
  
//       try {
//         const decoded = jwt.verify(refreshToken, secretKey);
//         const accessToken = jwt.sign({ user: decoded.user }, secretKey, { expiresIn: '1h' });
  
//         res
//           .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
//           .header('Authorization', accessToken)
//           .send(decoded.user);
//       } catch (error) {
//         return res.status(400).send('Invalid Token.');
//       }
//     }
//   };