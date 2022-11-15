// npm init -y
// npm i express
// npm i mongoose
// npm i hbs

//requirements
require('dotenv').config();
const express=require("express");
const app=express();
const port=process.env.PORT || 8000;
require("./conn.js");
const path=require("path");
const hbs=require("hbs");
const Register=require("./registers");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const cookieParser=require("cookie-parser");
const auth=require("./auth");

//paths
const templatePath=path.join(__dirname,"./templates/views");
const partialPath=path.join(__dirname,"./templates/partials");


//app.use(express.static(staticPath));
app.use(express.json());//for getting form values
app.use(express.urlencoded({encoded:false}));//we will get undefined if we will not use this line
app.use(cookieParser());

app.set("view engine","hbs");
app.set("views",templatePath);
hbs.registerPartials(partialPath);

//console.log(process.env.SECRET_KEY);

app.get("/",(req,res)=>{
    res.render("index");
})

app.get("/index",(req,res)=>{
    res.render("index");
})

app.get("/kangarooms1",(req,res)=>{
    res.render("kangarooms1");
})

app.get("/secret",auth,(req,res)=>{//here auth is  middleware and after checking that page
    //secret page is rendered
    //console.log(`cookie value is ${req.cookies.jwt}`);
    res.render("secret");
})

app.get("/login",(req,res)=>{
    res.render("login");
})

app.get("/logout",auth,async (req,res)=>{
    try {
        //for single device

        //console.log("Logout");
        // req.user.tokens=req.user.tokens.filter((currElement)=>{
        //     return currElement.token!=req.token;
        // })
        
        //from all devices'
        req.user.tokens=[];
        res.clearCookie("jwt");
        await req.user.save();
        res.render("login");
    } catch (error) {
        console.log(error);
    }
})

app.get("/register",(req,res)=>{
    res.render("register");
})

//while creating an account this will be rendered
app.post("/register",async(req,res)=>{
    try{
        //console.log(req.body.firstName);//undefined if we will not use app.use(express.urlencoded({encoded:false}));
        //res.send(req.body.firstName);
        const password=req.body.password;
        const confirmpassword=req.body.confirmPassword;
        if(password===confirmpassword){
            const registerEmployee=new Register({
                firstname: req.body.firstName,
                lastname: req.body.lastName,
                email: req.body.email,
                gender: req.body.gender,
                phonenumber: req.body.phoneNumber,
                age: req.body.age,
                password: req.body.password,
                confirmpassword: req.body.confirmPassword
            })

            const token=await registerEmployee.generateAuthToken();
            //console.log(token);
            res.cookie("jwt",token,{
                expiresIn: new Date(Date.now()+30000),//if expires in is not there, cookies will be deleted after refreshing a page
                httpOnly:true
            });
            //console.log(cookie);

            const registered=await registerEmployee.save();
            res.status(201).render("index");
        }
        else{
            res.send("passwords are not matching");
        }
    }
    catch(err){
        console.log(err);
    }
})

//while logging in, this will be rendered
app.post("/login",async(req,res)=>{
    try{
        const email=req.body.email;
        const password=req.body.password;
        const usermail=await Register.findOne({email:email});
        //solution for storing encrypted passwords and 
        const isMatch=await bcrypt.compare(password,usermail.password);
        
        const token=await usermail.generateAuthToken();
        //console.log(`token part is ${token}`);

        res.cookie("jwt",token,{
            expiresIn: new Date(Date.now()+300000),//if expires in is not there, cookies will be deleted after refreshing a page
            httpOnly:true
//            secure:true
        });

     //   console.log(`cookie value is ${req.cookies.jwt} endss`);

        if(isMatch){
            res.render("index");
        }
        else{
            res.send("Login unsuccessful")
        }
    }
    catch(err){
        console.log(err);
    }
})


//generating tokens
const createToken=async()=>{
    const token=await jwt.sign({_id:"13135153415"},"secretkeyshouldbegreaterthan32adafcsf",{
        expiresIn:"2 minutes"
    });
    //console.log(token);
    //before dot it is header
    //before second dot payload
    const userVerify=await jwt.verify(token,"secretkeyshouldbegreaterthan32adafcsf");/*error if secret key is not matching */
    //console.log(userVerify);
}
createToken();



app.listen(port,()=>{
    console.log("server listening");
})

