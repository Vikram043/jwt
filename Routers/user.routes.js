const express=require("express")
const userRoute=express.Router()
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const { UserModel } = require("../modules/user.module")
const { Blacklist } = require("../modules/blacklist.model")


userRoute.post("/signin",async(req,res)=>{
    const {name,email,password,role}=req.body
    try {
        const user_exists=await UserModel.findOne({email})
        if(user_exists){
            return res.status(400).send({msg:"User exits please login"})
        }
        const hash=bcrypt.hashSync(password,5)
        if(!hash){
            return res.status(400).send({msg:"Somthing went wrong plese try again"})
        }
        const user=new UserModel({...req.body,password:hash})
        await user.save()
        res.status(200).send({msg:"Sign in sucessful",user})
    } catch (error) {
        res.status(400).status({msg:error.message})
    }
})

userRoute.post("/login",async(req,res)=>{
    const {email,password}=req.body
    try {
        const user_exists=await UserModel.findOne({email})
        if(!user_exists){
            return res.status(400).send({msg:"User not found please signin"})
        }
        const decode=bcrypt.compareSync(password,user_exists.password)
        if(!decode){
            return res.status(400).send({msg:"Wrong Creditionals"})
        }

        const AccessToken=jwt.sign({email,role:user_exists.role,userId:user_exists.id},process.env.key,{expiresIn:"1h"})
        const RefreshToken=jwt.sign({email,role:user_exists.role,userId:user_exists.id},process.env.key,{expiresIn:"7h"})
        res.cookie("AccessToken",AccessToken)
        res.cookie("RefreshToken",RefreshToken)
        res.status(200).send({msg:"Login Sucessfull"})
    } catch (error) {
        res.status(400).send({msg:error.message})
    }
})

userRoute.get("/logout",async(req,res)=>{
    const{AccessToken,RefreshToken}=req.cookies
    try {
       const B_AccessToken=new Blacklist({token:AccessToken})
       const R_AccessToken=new Blacklist({token:RefreshToken})
        await B_AccessToken.save()
        await R_AccessToken.save()
        res.status(200).send({msg:"Logout Succesfull"})
    } catch (error) {
        res.status(400).send({msg:error.message})
    }
})

userRoute.get("/refresh",async(req,res)=>{
    const{RefreshToken}=req.cookies
    console.log(RefreshToken)
    try {
      const logout=await Blacklist.findOne({token:RefreshToken})
      if(logout){
        return res.status(400).send({msg:"Login Again as you logged out"})
      }
      const decode=jwt.verify(RefreshToken,process.env.key)
      if(!decode){
        return res.status(400).send({msg:"JWT expered please login again"})
      }
      const AccessToken=jwt.sign({email:decode.email,role:decode.role,userId:decode.userId},process.env.key,{expiresIn:"60"})
        res.cookie("AccessToken",AccessToken)
        res.status(200).send({msg:"Token Generated"})
    } catch (error) {
        res.status(400).send({msg:error.message})
    }
})

module.exports={userRoute}