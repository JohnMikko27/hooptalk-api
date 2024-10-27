const express = require("express");
const cors = require("cors");
require("dotenv").config();

if (process.env.NODE_ENV === "production") {
  process.env.DATABASE_URL = process.env.PROD_DATABASE_URL;
} else {
  process.env.DATABASE_URL = process.env.DEV_DATABASE_URL;
}

const app = express();
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
  res.send("hi user");
});

app.listen(3000, () => console.log("Server listening on port 3000..."));