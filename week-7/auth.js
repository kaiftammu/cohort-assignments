const jwt = require("jsonwebtoken");
const JWT_SECRET = "ilovesanju1212";

function auth (req, res, next){
    const token = req.headers.authorisation;
    const response = jwt.verify(token,JWT_SECRET);

    if(response){
        req.userId = response.id;
        next();
    } else {
        res.status(403).json({
            message: "incorrect credentials"
        })
    }
}

module.exports = {
    auth,
    JWT_SECRET
}