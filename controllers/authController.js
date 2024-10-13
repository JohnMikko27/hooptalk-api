const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const prisma = new PrismaClient();

exports.getToken = asyncHandler(async(req, res, next) => {
  jwt.sign({ user: req.user }, process.env.SECRET, (err, token) => {
    res.json({ token });
  });
});

exports.setToken = asyncHandler(async(req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

exports.verifyToken = asyncHandler(async(req, res, next) => {
  jwt.verify(req.token, process.env.SECRET, (err, data) => {
    if (err) {
      res.status(401).json({ message: "Unauthorized"});
    } else {
      req.user = data.user
      next();
    }
  });
});

exports.getUser = asyncHandler(async(req, res, next) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) }
  });
  console.log(user)
  res.json(user)
})

exports.isPostAuthor = asyncHandler(async(req, res, next) => {
  const post = await prisma.post.findUnique({
    where: {
      id: parseInt(req.params.postId)
    }
  });
  if (post.authorId === req.user.id) {
    next();
  } else {
    res.status(403).json({ message: "You do not have permission..."});
  }
});

exports.isCommentAuthor = asyncHandler(async(req, res, next) => {
  const comment = await prisma.comment.findUnique({
    where: { id: parseInt(req.params.commentId)}
  });
  if (comment.authorId === req.user.id) {
    next();
  } else {
    res.status(403).json({ message: "You do not have permission..."});
  }
});

exports.createUser = [
  body("username").trim().notEmpty().withMessage("Username cannot be empty."),
  body("password").trim().notEmpty().withMessage("Password cannot be empty."),
  body("confirmPassword").custom((value, { req }) => {
    return value === req.body.password;
  }).withMessage("Passwords must match."),

  asyncHandler(async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()});
    }

    const { username, password } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });
    if (existingUser) {
      res.status(400).json({ message: "Username already exists. Choose a different one."});
    }

    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err) {
        res.status(400).json();
      }
      const user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword
        }
      });
    
      res.json(user);
    });
  })
];