const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorisation']
    if (!token) {
        res.status(403).end()
    }
    token = token.split(' ')[1]

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if(err) {
            return res.status(403).end()
        } else {
            req.decoded = decoded
            next()
        }
    })
}

const signToken = (inputEmail) => {
    return jwt.sign({
        email: inputEmail},
        process.env.SECRET_KEY,
        {expiresIn: '1h'})
}

module.exports = {verifyToken, signToken}