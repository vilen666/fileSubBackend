const mongoose=require("mongoose");
const adminSchema= mongoose.Schema({
    username:String,
    password:String,
    subcodes : [
        {subid:{type: String}}
    ]
})
module.exports = mongoose.model("admin",adminSchema) 