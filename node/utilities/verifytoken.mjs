import jwt from "jsonwebtoken"

export default function verifytoken (req,res,next) {
    const authHeader = req.header('Authorization') || ''
    const token = authHeader.replace(/^Bearer /, '')
    if (!token) {
        return res.status(401).send('Access Denied')
    }
    try {
        const verified = jwt.verify(token, process.env.SECRET_TOKEN)
        req.user = verified
        next()
    } catch (error) {
        res.status(401).send('Invalid Token')
    }
}