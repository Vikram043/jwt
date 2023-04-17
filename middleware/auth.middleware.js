const jwt=require("jsonwebtoken")
const { Blacklist } = require("../modules/blacklist.model")
require("dotenv").config()


const auth= async(req,res,next)=>{
    const {AccessToken}=req.cookies
try {
    const logout=await Blacklist.findOne({token:AccessToken})
    if(logout){
      return res.status(400).send({msg:"Login Again"})
    }
    const decode=jwt.verify(AccessToken,process.env.key)
    if(!decode){
      return res.status(400).send({msg:"JWT expered please login again or refresh"})
    }
    req.role=decode.role
    req.userId=decode.userId
    next()
} catch (error) {
    res.status(400).send({msg:error.message})
}
}

module.exports={auth}