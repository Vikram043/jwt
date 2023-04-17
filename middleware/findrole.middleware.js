

function findrole(permittedrole){
    return function(req,res,next){
        console.log(req.role)
        if(permittedrole.includes(req.role)){
           return next()
        }else{
           return res.status(400).send({msg:"Unauthorized"})
        }
    }
}

module.exports={findrole}