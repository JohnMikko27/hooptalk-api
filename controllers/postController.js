const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const { body, validationResult } = require("express-validator");

const prisma = new PrismaClient();

exports.getPost = asyncHandler(async(req, res, next) => {
  const post = await prisma.post.findUnique({
    where: { id: parseInt(req.params.postId) }, 
    include: { author: true, posts: true }
  });
  if (!post) {
    res.status(404).json({ message: "Post with that id does not exist"});
  }
  res.json(post);
});


exports.updatePost = [
  body("title").trim().notEmpty().withMessage("title cannot be empty"),
  body("content").trim(),

  asyncHandler(async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()});
    }
        
    const { title, content } = req.body;
    const updatedPost = await prisma.post.update({
      where: {
        id: parseInt(req.params.postId)
      },
      data: {
        title,
        content
      }
    });

    res.json({ status: 200, message: "Post successfully updated." });
  })
];

exports.deletePost = asyncHandler(async(req, res, next) => {
  await prisma.post.deleteMany({ 
    where: { 
      postId: parseInt(req.params.postId) 
    }
  });

  await prisma.post.delete({
    where: {
      id: parseInt(req.params.postId)
    }
  });

  res.json({ status: 200, message: "Successfully deleted post" });
});

exports.createPost = [
  body("title").trim().notEmpty().withMessage("title cannot be empty"),
  body("content").trim(),

  asyncHandler(async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()});
    }
    const { title, content } = req.body;
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: req.user.id
      }
    });

    res.json({ status: 200, message: "Post successfully created." });
  })
];

exports.getAllPosts = asyncHandler(async(req, res, next) => {
  const allPosts = await prisma.post.findMany({
    include: {
      author: true,
    }
  });

  res.json(allPosts);
});

exports.likePost = asyncHandler(async(req, res, next) => {
  // get post, get userId, 
  // check if userId is already in post.userLiked 
  // if it is, remove it and decrement upvotes
  // if it isn't, add it and increment upvotes
  console.log(req.user)
  console.log(req.user.id)

  const post = await prisma.post.findUnique({
    where: { id: parseInt(req.params.postId) }
  })
  const alreadyLiked = post.usersLiked.includes(req.user.id)
  if (alreadyLiked) {
    await prisma.post.update({
      where: { id: parseInt(req.params.postId) },
      data: {
        upvotes: { decrement: 1 },
        usersLiked: { set: post.usersLiked.filter(id => id !== req.user.id )}
      }
    })

    res.json({ status: 200, message: "Post successfully unliked." })
  } else {
    await prisma.post.update({
      where: { id: parseInt(req.params.postId) },
      data: {
        upvotes: { increment: 1 },
        usersLiked: { push: req.user.id }
      }
    })

    res.json({ status: 200, message: "Post successfully liked." })
  }
});
