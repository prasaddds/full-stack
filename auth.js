const jwt=require("jsonwebtoken");
const Register=require("./registers");

const auth=async(req,res,next)=>{
    try {
        const token=req.cookies.jwt;//getting token from cookie
        const verifyUser=jwt.verify(token,process.env.SECRET_KEY);//we are verifying the tokens.
        //one which is generated from secret key and the one which is availabe in cookie
        //console.log(verifyUser);
        const user=await Register.findOne({_id:verifyUser._id});//there is an id which is generated along with id in database
        //console.log(`${user} and name is ${user.firstname}`);
        req.token=token;
        req.user=user;
        next();
    } catch (error) {
        console.log(error);
    }
}
module.exports=auth;