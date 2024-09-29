const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')
const authController = require("../controllers/authController")
const jwt = require("jsonwebtoken")
require("dotenv").config()

router.get("/:postId", postController.getPost)

router.put("/:postId", postController.updatePost)

router.delete("/:postId", postController.deletePost)

router.post("/", authController.verifyToken, (req, res, next) => {
    jwt.verify(req.token, process.env.SECRET, (err, authData) => {
        if (err) {
            res.status(403).json({ message: "Access denied"})
        } else {
            next()
        }
    })},
    postController.createPost)

router.get("/", postController.getAllPosts)

module.exports = router