const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();
require("./auth/passport");

// i should check every route and make sure its working as intended
// only authors/creators can delete/update their own posts/comments, should be error if not
// only able to create posts/comments if logged in
// read deployment lesson on TOP, deploy and get started on the frontend

const app = express();
const postRouter = require("./routes/post");
const authRouter = require("./routes/auth");
const commentRouter = require("./routes/comment");

app.use(session({ 
  store: new (require('connect-pg-simple')(session))({
  }),
  secret: process.env.SECRET, 
  resave: false, 
  saveUninitialized: false,
  cookie: { 
    maxAge: 1000 * 60 * 60 * 24 * 365 * 100 // 100 years 
  }
}));
app.use(passport.session());
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