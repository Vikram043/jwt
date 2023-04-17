const express=require("express")
const { BlogModel } = require("../modules/blogs.model")
const { findrole } = require("../middleware/findrole.middleware")
const blogRoute=express.Router()


blogRoute.get("/",async(req,res)=>{
    try {
        const blog=await BlogModel.find()
        res.status(200).send({msg:"All bloges",blog})
    } catch (error) {
        res.status(400).send({msg:error.message})
    }
})

blogRoute.post("/create",async(req,res)=>{
    const userId=req.userId
    try {
        const blog=new BlogModel({...req.body,userId:userId})
        await blog.save()
        res.status(200).send({msg:`new Blog created by user:${userId}`})
    } catch (error) {
        res.status(400).send({msg:error.message})
    }
})


blogRoute.patch("/update/:id",async(req,res)=>{
    const payload=req.body
    const {id}=req.params
    const userId=req.userId
    try {
        const blog=await BlogModel.populate('user').findByIdAndUpdate({_id:id},payload)
        if(!blog){
            return res.status(200).send({msg:`No blogs find in your id:${userId}`})
        }
        res.status(200).send({msg:`Blog updated by user:${userId}`})
    } catch (error) {
        res.status(400).send({msg:error.message})
    }
})

blogRoute.delete("/delete/:id",async(req,res)=>{
    const payload=req.body
    const {id}=req.params
    const userId=req.userId
    try {
        const blog=await BlogModel.populate('user').findByIdAndDelete({_id:id})
            if(!blog){
                return res.status(200).send({msg:`No blogs find in your id:${userId}`})
            }
        res.status(200).send({msg:`Blog deleted by user:${userId}`})
    } catch (error) {
        res.status(400).send({msg:error.message})
    }
})

blogRoute.patch("/update/:id",findrole(["Moderator"]),async(req,res)=>{
    const payload=req.body
    const {id}=req.params
    const userId=req.userId
    try {
        const blog=await BlogModel.findByIdAndUpdate({_id:id},payload)
        res.status(200).send({msg:`Blog updated by user:${userId}`})
    } catch (error) {
        res.status(400).send({msg:error.message})
    }
})
blogRoute.delete("moderator/delete/:id",findrole(["Moderator"]),async(req,res)=>{
    const {id}=req.params
    const userId=req.userId
    try {
        const blog=await BlogModel.findByIdAndDelete({_id:id})
        res.status(200).send({msg:`Blog deleted by user:${userId}`})
    } catch (error) {
        res.status(400).send({msg:error.message})
    }
})





module.exports={blogRoute}

