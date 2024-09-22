const asyncHandler = require("express-async-handler")
const { PrismaClient } = require("@prisma/client")
const { body, validationResult } = require("express-validator")

const prisma = new PrismaClient()

exports.getPost = asyncHandler(async(req, res, next) => {
    res.send('hi get post')
})

exports.createPost = [
    body("title").trim().notEmpty().withMessage("email cannot be empty"),
    body("content").trim(),

    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            console.log(errors)
            return res.status(400).json({ errors: errors.array()})
        }
        const { title, content } = req.body
        const post = await prisma.post.create({
            data: {
                title,
                content,
                authorId: 1 // change this to get currently logged in user
            }
        })

        res.json(post)
    })
]