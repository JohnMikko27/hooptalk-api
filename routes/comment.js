const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const authController = require("../controllers/authController");

const { setToken, verifyToken, isCommentAuthor } = authController;

router.post("/:postId/comments", setToken, 
  verifyToken, commentController.createComment);

router.delete("/:postId/comments/:commentId", setToken, 
  verifyToken, isCommentAuthor, commentController.deleteComment);

router.put("/:postId/comments/:commentId", setToken, 
  verifyToken, isCommentAuthor, commentController.updateComment);


router.get("/:postId/comments", (req, res) => res.send(`here: ${req.params.postId}`));

module.exports = router;