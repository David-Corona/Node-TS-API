const jwt = require("jsonwebtoken");


module.exports = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({message: "Unauthorized - No headers provided."});
    }

    const token = req.headers.authorization.split(" ")[1]; // "Bearer longtokenstring"
    if (!token) {
        return res.status(401).json({message: "Unauthorized - No token provided."});
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userData = {email: decodedToken.email, userId: decodedToken.userId};
        next();
    } catch (e) {
        res.status(401).json({
            message: "Unauthorized - Invalid token.",
            error: e
        });
    }
}