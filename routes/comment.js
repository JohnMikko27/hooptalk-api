const express = require("express")
const router = express.Router()
const commentController = require("../controllers/commentController")
const authController = require("../controllers/authController")

const { isAuthenticated, setToken, verifyToken, isCommentAuthor } = authController

router.post("/:postId/comments", isAuthenticated, setToken, 
    verifyToken, commentController.createComment)

router.delete("/:postId/comments/:commentId", isAuthenticated, setToken, 
    verifyToken, isCommentAuthor, commentController.deleteComment)

router.put("/:postId/comments/:commentId", isAuthenticated, setToken, 
    verifyToken, isCommentAuthor, commentController.updateComment)

router.get("/:postId/comments", (req, res) => res.send(`here: ${req.params.postId}`))

module.exports = router