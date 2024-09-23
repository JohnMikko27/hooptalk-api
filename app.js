const express = require("express")
const cors = require("cors")
const session = require("express-session");
const passport = require("passport");
require("dotenv").config()
require("./auth/passport")

const app = express()
const userRouter = require("./routes/user")
const postRouter = require("./routes/post")
const authRouter = require("./auth/auth")

app.use(session({ secret: process.env.SECRET, resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/users", userRouter)
app.use("/posts", postRouter)
app.use("/", authRouter)
app.get("/", (req, res) => {
    console.log(req.user)
    res.send("hi miks")
})

app.listen(3000, () => console.log("Server listening on port 3000..."))