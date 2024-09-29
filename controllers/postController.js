const asyncHandler = require("express-async-handler")
const { PrismaClient } = require("@prisma/client")
const { body, validationResult } = require("express-validator")

const prisma = new PrismaClient()

exports.getPost = asyncHandler(async(req, res, next) => {
    const post = await prisma.post.findUnique({
        where: {
            id: parseInt(req.params.postId)
        }
    })
    if (!post) {
        res.status(404).json({ message: "Post with that id does not exist"})
    }
    
    res.json(post)
})


exports.updatePost = [
    body("title").trim().notEmpty().withMessage("title cannot be empty"),
    body("content").trim(),

    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            console.log(errors)
            return res.status(400).json({ errors: errors.array()})
        }
        
        const { title, content } = req.body
        const updatedPost = await prisma.post.update({
            where: {
                id: parseInt(req.params.postId)
            },
            data: {
                title,
                content
            }
        })

        res.json(updatedPost)
    })
]

exports.deletePost = asyncHandler(async(req, res, next) => {
    await prisma.post.delete({
        where: {
            id: parseInt(req.params.postId)
        }
    })

    res.json({ message: "Successfully deleted post" })
})

exports.createPost = [
    body("title").trim().notEmpty().withMessage("title cannot be empty"),
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
                authorId: req.user.id
            }
        })

        res.json(post)
    })
]

exports.getAllPosts = asyncHandler(async(req, res, next) => {
    const allPosts = await prisma.post.findMany()

    res.json(allPosts)
})
