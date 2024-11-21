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
const server = createServer(app);


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/posts", commentRouter);
app.use("/posts", postRouter);
app.use("/", authRouter);
app.get("/", (req, res) => {
  res.send("Hi user!")
});

// also to avoid clunking up app.js maybe add all the socket.io stuff in another file 
// and just load into here like how i do with dotenv
// add frontend dev and prod url
const io = new Server(server, { cors: { origin: "http://localhost:5173" }})

io.on("connection", (socket) => {
  console.log("a user connected")

  socket.on("newComment", async(data) => {
    console.log(data)
    // const allComments = await prisma.comment.findMany({ where: { postId: data.postId }})
    // console.log(allComments)
    io.emit("updatedComments")
  })
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
    socket.disconnect()
  });
})


server.listen(3000, () => console.log("Server listening on port 3000..."));