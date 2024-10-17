const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const { body, validationResult } = require("express-validator");

const prisma = new PrismaClient();

exports.getPost = asyncHandler(async(req, res, next) => {
  const post = await prisma.post.findUnique({
    where: { id: parseInt(req.params.postId) }, 
    include: { author: true, comments: true }
  });
  if (!post) {
    return res.status(404).json({ message: "Post with that id does not exist"});
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
  const filter = req.query.sort
  if (filter === "latest" || filter === "oldest") {
    const allPosts = await prisma.post.findMany({
      include: { author: true },
      orderBy: { createdAt: filter === "latest" ? "desc" : "asc" }
    }) 

    return res.json(allPosts);
  } else if (filter === "popular") {
    const allPosts = await prisma.post.findMany({
      include: { author: true },
      orderBy: { upvotes: "desc"}
    })
    
    return res.json(allPosts);
  }
  const allPosts = await prisma.post.findMany({
    where: {
      OR: [
        { title: { contains: req.query.search }},
        { content: { contains: req.query.search }},
      ]
    },
    include: { author: true}
  })

  res.json(allPosts);
});

exports.likePost = asyncHandler(async(req, res, next) => {
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

    return res.json({ status: 200, message: "Post successfully unliked." })
  } 
  
  await prisma.post.update({
    where: { id: parseInt(req.params.postId) },
    data: {
      upvotes: { increment: 1 },
      usersLiked: { push: req.user.id }
    }
  })

  res.json({ status: 200, message: "Post successfully liked." })
});
