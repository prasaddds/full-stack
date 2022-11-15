const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

const employeeSchema= new mongoose.Schema({
    firstname:{
        type: String,
        required: true,
    },
    lastname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    gender:{
        type:String,
        required: true
    },
    phonenumber:{
        type: Number,
        required: true,
        unique: true
    },
    age:{
        type: Number,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    confirmpassword:{
        type: String,
        required: true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

//generating tokens
employeeSchema.methods.generateAuthToken=async function(){
    try{
        //console.log(`id is ${this._id}`);
        const token=jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY)//thistoken
        this.tokens=this.tokens.concat({token:token});//setting the value of token in database
        await this.save();
        return token;
    }
    catch(err){
        console.log(err);
    }
}

//hashing passwords
employeeSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10);
        console.log(`the current password is ${this.password}`);
        this.confirmpassword=await bcrypt.hash(this.password,10);
    }
    next();
})

const Register=new mongoose.model("Register",employeeSchema);
module.exports=Register;//Regsiter is a collection