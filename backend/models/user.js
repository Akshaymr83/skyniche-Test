const mongoose=require('mongoose')
const userSchema =mongoose.Schema({
    firstname:String,
    lastname:String,
   designation:String,
   date:String,
   image:String,
   email:String,
   salary:Number,
   department:String,
   ID:String
    
})
const userModel = mongoose.model("Employee",userSchema)
module.exports=userModel;