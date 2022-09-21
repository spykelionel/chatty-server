import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import User from '../models/User.js'

export default async function login(req, res){
    try {
       const client =  User.findOne({ name: req.body.name})
       client.then(user=>{
            console.log(user)
            if(user){
                // compare passwords
                bcrypt.compare(req.body.password, user.password, (error, success)=> {
                    if(!success){
                        return res.status(501).json({status:501, from: "Server 2", message: "Error authenticating user"})
                    }
                    const token = jwt.sign({
                    active_user: user.name,
                    id: user._id
                    }, process.env.JWT_SECRET, {expiresIn: "1d"})
                    return res.status(201).json({
                        user,
                        token,
                        status:200,
                        validity: "24h",
                        refreshed: false,
                        created_at: new Date().toJSON("time"),
                    })
                })
                
            }
       })
       .catch({

       })
    } catch (error) {
        console.log(error)
       return res.status(501).json({status:501, from: "Server n", message: "Error authenticating user"})
    }
}

const matchUniqueKey = _ =>  new RegExp("E?/\o\g?:12+\wkr?krud+e")