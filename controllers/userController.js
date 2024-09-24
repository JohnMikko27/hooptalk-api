const asyncHandler = require("express-async-handler")
const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")
const { body, validationResult } = require("express-validator")

const prisma = new PrismaClient()

exports.createUser = [
    body("username").trim().notEmpty().withMessage("Username cannot be empty."),
    body("password").trim().notEmpty().withMessage("Password cannot be empty."),
    body('confirmPassword').custom((value, { req }) => {
        return value === req.body.password;
    }).withMessage("Passwords must match."),

    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            console.log(errors)
            return res.status(400).json({ errors: errors.array()})
        }

        const { username, password } = req.body
        const existingUser = await prisma.user.findUnique({
            where: { username }
        })
        if (existingUser) {
            res.status(400).json({ message: "Username already exists. Choose a different one."})
        }

        bcrypt.hash(password, 10, async (err, hashedPassword) => {
            if (err) {
                res.status(400).json()
            }
            const user = await prisma.user.create({
                data: {
                    username,
                    password: hashedPassword
                }
            })
    
            res.json(user)
        });
    })
]