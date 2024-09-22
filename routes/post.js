const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')

router.get("/:id", postController.getPost)

router.post("/", postController.createPost)

router.get("/", postController.getAllPosts)

module.exports = router