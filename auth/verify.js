import jwt from 'jsonwebtoken'

export default function(req, res, next){
    try {
        const token = req.headers['authorization'].split(' ')[1]
        // console.log(token)
        req.userData = jwt.verify(token, process.env.JWT_SECRET)
        // next(req.userData)
        next()
    } catch (error) {
        return res.status(401).json({...error,status:401, message: "Error verifying user"})
    }
}