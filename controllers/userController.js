const asyncHandler = require("express-async-handler")
const { PrismaClient } = require("@prisma/client")
const { body, validationResult } = require("express-validator")

const prisma = new PrismaClient()

exports.createUser = [
    body("email").trim().notEmpty().withMessage("email cannot be empty"),
    body("username").trim().notEmpty().withMessage("username cannot be empty"),
    body("password").trim().notEmpty().withMessage("password cannot be empty"),
    body('confirmPassword').custom((value, { req }) => {
        return value === req.body.password;
    }),

    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            console.log('errors')
            console.log(errors)
            return res.status(400).json({ errors: errors.array()})
        }

        const { email, username, password } = req.body
        const user = await prisma.user.create({
            data: {
                email,
                username,
                password
            }
        })
        res.json(user)
    })
]