// when creating comments, I have to get the postId from the url 
// and then find postId in db and add the comment to that Post's comments array?

// and then I have to add authorization so that only the author of the comment can actually update/delete it

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

    res.json({ status: 200, "message": "Comment successfully deleted." });
  })
];

exports.deleteComment = asyncHandler(async(req, res, next) => {
  await prisma.comment.delete({
    where: { id: parseInt(req.params.commentId)}
  });

  res.json({ status: 200, message: "Comment successfully deleted."});
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

    res.json({ status: 200, message: "Comment successfully updated."});
  })
];