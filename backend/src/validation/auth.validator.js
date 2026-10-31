import {body, validationResult} from "express-validator";

const validate = (req, res, next) => {
    const errors = validationResult(req)

    if(errors.isEmpty()){
        return next()
    }

    res.status(400).json({
        errors: errors.array()
    })

}

export const registerValidation = [
    body('username').isString().withMessage("Username must be a string").notEmpty().withMessage('Username is required'),

    body('email').isEmail().withMessage('Invalid email'),

    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),

    validate
]
