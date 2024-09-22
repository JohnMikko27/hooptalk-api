const express = require("express")
const app = express()
const cors = require("cors")
const userRouter = require("./routes/user")
const postRouter = require("./routes/post")

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/users", userRouter)
app.use("/posts", postRouter)
app.get("/", (req, res) => res.send('hi miks'))

app.listen(3000, () => console.log("Server listening on port 3000..."))