var jwt = require('jsonwebtoken');
JWT_SCERET = 'sdhfoahgagegreorgoegjg'

const fetchuser = (req, res, next) => {
    // Get the user from the jwt token and add id to req object
    const token = req.header('auth-token');
    if (!token) {
         res.status(401).send({ message: "Access denied. Provide a valid token" });
        }
        try {
            const data =  jwt.verify(token, JWT_SCERET)
            req.user = data.user;
            next()
        } catch (error) {
            res.status(401).send({ message: "Access denied. No token provided." });
        }
       
}

module.exports = fetchuser;