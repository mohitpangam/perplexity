import jwt from "jsonwebtoken"
import redis from "../config/cache.js";

export async function authUser(req, res, next){
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            message: "Unauthorized user",
            success: false,
            err: "Token not provided"
        })
    }

    const isTokenBlacklisted = await redis.get(token)

    if(isTokenBlacklisted){
        return res.status(401).json({
            message: "Invalid token"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded

        next()

    }catch(err){
        return res.status(401).json({
            message: "Unauthorized user",
            success: false,
            err: "Invalid Token"
        })
    }
}