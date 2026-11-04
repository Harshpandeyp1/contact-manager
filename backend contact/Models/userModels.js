const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please add a name"],
    },
    email:{
        type:String,
        required:[true,"Please add a Email"],
        unique:[true,"Email already exists"],
    },
    password:{
        type:String,
        required:[true,"Please add a Password"],
    },
},{
    timestamps:true,
}
);
module.exports=mongoose.model("User",userSchema);