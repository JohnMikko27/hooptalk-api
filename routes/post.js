const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authController = require("../controllers/authController");
require("dotenv").config();

const { setToken, verifyToken, isPostAuthor } = authController;

router.post("/:postId/like", setToken, 
  verifyToken, postController.likePost);

router.get("/:postId", postController.getPost);

router.put("/:postId", setToken, 
  verifyToken, isPostAuthor, postController.updatePost);

router.delete("/:postId", setToken, 
  verifyToken, isPostAuthor, postController.deletePost);

router.post("/", setToken, verifyToken, postController.createPost);

router.get("/", postController.getAllPosts);

module.exports = router;