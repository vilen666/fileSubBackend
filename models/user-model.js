const mongoose=require("mongoose");
const userSchema= mongoose.Schema({
    name:String,
    email:String,
    phone:String,
    roll:String,
    pdfs: [
        {
          subcode:{type: String, required: true},
          filename: { type: String, required: true },
          data: { type: Buffer, required: true },
          contentType: { type: String, required: true },
        }
      ]
})
module.exports = mongoose.model("user",userSchema)