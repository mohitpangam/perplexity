import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";
import redis from "../config/cache.js"; 

export async function registerUser(req, res){
    const {username, email, password} = req.body;

    const findUser = await userModel.findOne({email})

    if(findUser){
        return res.status(400).json({
            message: "User already exists",
            success: false,
            err:"User already exists"
        })
    }

    const user = await userModel.create({
        username,
        email,
        password
    })

    const emailVerificationToken = jwt.sign(
        {
            email: user.email
        },
        process.env.JWT_SECRET
    )

    await sendEmail({
        to: email,
        subject: "Welcome to perplexity!",
        html: `
        <h1>Welcome ${username}</h1>
        <p>Thank you for registering with us.</p>
        <p>To verify your email click on the link below</p>
        <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
        `
    })

    return res.status(201).json({
        message: "User registered successfully",
        success: true,
        user: {
            username: user.username,
            email: user.email,           
        }
    })

}

export async function resendEmail(req, res){
    const {email} = req.body

    const user = await userModel.findOne({email})

    if(!user){
        return res.status(404).json({
            message: "user not found",
            success: false,
            err: "user not found"
        })
    }

    if(user.verified === true){
        return res.status(409).json({
            message: "Already verified",
            success: true,
            err:"Already verified"
        })
    }

    const emailVerificationToken = jwt.sign(
        {
            email: user.email
        },
        process.env.JWT_SECRET
    )

    await sendEmail({
        to: email,
        subject: "Email Verification",
        html: `
        <h1>Email Verification</h1>
        <p>Thank you for registering with us.</p>
        <p>To verify your email click on the link below</p>
        <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
        `
    })

    res.status(200).json({
        message: "Email has been sent successfully",
        success: true
    })
}

export async function loginUser(req, res){
    const {username, email, password} = req.body

    const user = await userModel.findOne({
        $or: [
            {username},
            {email}
        ]
    })

    if(!user){
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "User not found"
        })
    }

    const isPasswordCorrect = await user.comparePassword(password)

    if(!isPasswordCorrect){
        return res.status(401).json({
            message: "Invalid email or password",
            success: false,
            err: "Invalid email or password"
        })
    }

    if(!user.verified){
        return res.status(400).json({
            message: "Please verify your email",
            success: false,
            err: "Please verify your email"
        })
    }

    const token = jwt.sign(
        {
            id: user._id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    )

    res.cookie("token", token)

    res.status(200).json({
        message: "Login successfull",
        success: true,
        user: {
            username: user.username,
            email: user.email
        }
    })

}

export async function verifyEmail(req, res){
 
    const {token} = req.query

    try{

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
        const user = await userModel.findOne({
            email: decoded.email
        })
    
        if(!user){
            return res.status(400).json({
                message: "Invalid token",
                success: false,
                err: "Invalid token"
            })
        }

        if(user.verified === true){
            const html = `<h1>hi ${user.username}, you've already been verified</h1>`
            return res.send(html)
        }
    
        user.verified = true
    
        await user.save()
    
        const html = `<h1>hi ${user.username}, you've been verified</h1>
        <p>click here to login </p>
        <a href="http://localhost:5173/login">Login</a>
        `
    
        res.send(html)

    }catch(err){
        return res.status(400).json({
            message: "Invalid or expired token",
            success: false,
            err: "Invalid or expired token"
        })
    }

} 

export async function getMe(req, res){
    const {id} = req.user

    const user = await userModel.findById(id).select("-password")

    if(!user){
        return res.status(404).json({
            message: "User not found",
            success: false,
            err: "User not found"
        })
    }

    return res.status(200).json({
        message: "User fetched successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}

export async function logoutUser(req, res){
    const token = req.cookies.token

    res.clearCookie("token")

    redis.set(token, Date.now().toString(), "EX", 60*60)

    res.status(200).json({
        message: "logout successfully"
    })
    
}