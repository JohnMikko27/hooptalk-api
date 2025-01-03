const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const { body, validationResult } = require("express-validator");

const prisma = new PrismaClient();

exports.createComment = [
  body("content").notEmpty().withMessage("content cannot be empty"),

  asyncHandler(async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()});
    }

    const comment = await prisma.comment.create({
      data: {
        content: req.body.content,
        postId: parseInt(req.params.postId),
        authorId: parseInt(req.user.id)
      }
    });

    res.json({ status: 200, "message": "Comment successfully created.", comment: comment});
  })
];

exports.deleteComment = asyncHandler(async(req, res, next) => {
  await prisma.comment.delete({
    where: { id: parseInt(req.params.commentId)}
  });
  
  res.json({ status: 200, message: "Comment successfully deleted." });
});

exports.updateComment = [
  body("content").notEmpty().withMessage("content cannot be empty"),

  asyncHandler(async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()});
    }
        
    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(req.params.commentId)},
      data: {
        content: req.body.content,
      }
    });

    res.json({ status: 200, message: "Comment successfully updated.", comment: updatedComment });
  })
];

exports.likeComment = asyncHandler(async(req, res, next) => {
  const comment = await prisma.comment.findUnique({
    where: { id: parseInt(req.params.commentId) }
  })
  const alreadyLiked = comment.usersLiked.includes(req.user.id)
  if (alreadyLiked) {
    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(req.params.commentId) },
      data: {
        upvotes: { decrement: 1 },
        usersLiked: { set: comment.usersLiked.filter(id => id !== req.user.id )}
      }, 
      include: { post: true, author: true }
    })

    return res.json({ status: 200, message: "Comment successfully unliked.", comment: updatedComment })
  } 
  
  const updatedComment = await prisma.comment.update({
    where: { id: parseInt(req.params.commentId) },
    data: {
      upvotes: { increment: 1 },
      usersLiked: { push: req.user.id }
    },
    include: { post: true, author: true }
  })

  res.json({ status: 200, message: "Comment successfully liked.", comment: updatedComment })
})