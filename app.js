const express = require("express")
const cors = require("cors")
const session = require("express-session");
const passport = require("passport");
require("dotenv").config()
require("./auth/passport")

const app = express()
const postRouter = require("./routes/post")
const authRouter = require("./routes/auth")
const commentRouter = require("./routes/comment")

app.use(session({ 
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

app.use("/posts", commentRouter)
app.use("/posts", postRouter)
app.use("/", authRouter)
app.get("/", (req, res) => {
    if (!req.user) console.log("none")
    else console.log(req.user)
    res.send("hi miks")
})

app.listen(3000, () => console.log("Server listening on port 3000..."))