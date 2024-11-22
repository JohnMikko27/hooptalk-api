const express = require("express");
const { createServer } = require('node:http');
const { PrismaClient } = require("@prisma/client");
const { Server } = require("socket.io")
const cors = require("cors");
require("dotenv").config();

if (process.env.NODE_ENV === "production") {
  process.env.DATABASE_URL = process.env.PROD_DATABASE_URL;
} else {
  process.env.DATABASE_URL = process.env.DEV_DATABASE_URL;
}

const app = express();
const prisma = new PrismaClient()

const postRouter = require("./routes/post");
const authRouter = require("./routes/auth");
const commentRouter = require("./routes/comment");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/posts", commentRouter);
app.use("/posts", postRouter);
app.use("/", authRouter);
app.get("/", (req, res) => {
  res.send("Hi user!")
});

const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" }})

io.on("connection", (socket) => {

  socket.on("submitComment", async(data) => {
    const allComments = await prisma.comment.findMany({ where: { postId: data.postId }})
    io.emit("allComments", allComments)
  })

  socket.on("newPost", async() => {
    const allPosts = await prisma.post.findMany({
      include: { author: true },
      orderBy: { createdAt: "desc" }
    }) 
    io.emit("allPosts", allPosts)
  })
  
  socket.on('disconnect', () => {
    socket.disconnect()
  });
})


server.listen(3000, () => console.log("Server listening on port 3000..."));