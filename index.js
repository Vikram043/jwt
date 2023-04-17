const express=require("express")
const { connection } = require("./db")
const cookieParser=require("cookie-parser")
const { userRoute } = require("./Routers/user.routes")
const { auth } = require("./middleware/auth.middleware")
const { blogRoute } = require("./Routers/blog.router")
const app=express()

app.use(express.json())
app.use(cookieParser())

app.use("/",userRoute)
app.use("/",auth,blogRoute)

app.listen(process.env.port,async()=>{
    try {
        await connection
        console.log("Connected to DB")
    } catch (error) {
        console.log("Unable to connect to DB")
        console.log(error)
    }
})