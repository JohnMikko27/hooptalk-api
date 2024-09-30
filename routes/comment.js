const express = require("express")
const router = express.Router()
const commentController = require("../controllers/commentController")

// now add the auth middleware
router.get("/:postId/comments", (req, res) => res.send(`here: ${req.params.postId}`))

router.post("/:postId/comments", commentController.createComment)

router.delete("/:postId/comments/:commentId", commentController.deleteComment)

router.put("/:postId/comments/:commentId", commentController.updateComment)

module.exports = router