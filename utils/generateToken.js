let jwt= require("jsonwebtoken")
const generateToken=(user)=>{
    return jwt.sign({_id:user._id},process.env.JWT_KEY)
}
module.exports.generateToken=generateToken