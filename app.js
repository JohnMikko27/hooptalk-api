const express = require("express")
const cors = require("cors")
const session = require("express-session");
const passport = require("passport");
require("dotenv").config()
require("./auth/passport")

const app = express()
const postRouter = require("./routes/post")
const authRouter = require("./routes/auth")

app.use(session({ secret: process.env.SECRET, resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/posts", postRouter)
app.use("/", authRouter)
app.get("/", (req, res) => {
    res.send("hi miks")
})

app.listen(3000, () => console.log("Server listening on port 3000..."))