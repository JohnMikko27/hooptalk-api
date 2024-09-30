const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')
const authController = require("../controllers/authController")
require("dotenv").config()

const { isAuthenticated, setToken, verifyToken, isPostAuthor } = authController

router.get("/:postId", postController.getPost)

router.put("/:postId", isAuthenticated, setToken, 
    verifyToken, isPostAuthor, postController.updatePost)

router.delete("/:postId", isAuthenticated, setToken, 
    verifyToken, isPostAuthor, postController.deletePost)

router.post("/", isAuthenticated, setToken, verifyToken, postController.createPost)

router.get("/", postController.getAllPosts)

module.exports = router