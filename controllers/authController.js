const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const prisma = new PrismaClient();

exports.getToken = asyncHandler(async(req, res, next) => {
  const { username, password } = req.body;
  const result = await verifyUser(username, password)
  if (result.status === false) {
    return res.status(401).json({ status: 401, message: "Unauthorized" })
  }

  jwt.sign({ user: result.user }, process.env.SECRET, (err, token) => {
    res.json({ 
      status: 200, 
      token, 
      user: { id: result.user.id, username: result.user.username, pfp: result.user.pfpUrl },
      message: "Login successful." 
    });
  });
});

const verifyUser = async (username, password) => {
  const user = await prisma.user.findUnique({
    where: { username: username },
  });

  if (!user) {
    return { status: false, message: 'Incorrect username' };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return { status: false, message: 'Incorrect password' };
  }

  return { user };
};

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
  const user = await prisma.user.findUnique({
    where: { id: parseInt(req.params.id) }
  });

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
      await prisma.user.create({
        data: {
          username,
          password: hashedPassword
        }
      });
    
      res.json({ status: 200, message: "User successfully created." });
    });
  })
];

// add rest of fields once I implement it in frontend
exports.updateUser = asyncHandler(async(req, res, next) => {
  console.log(req.body)
  await prisma.user.update({
    where: { id: req.user.id },
    data: { pfpUrl: req.body.media }
  })
  res.status(200).json({ message: "ok"})
})
