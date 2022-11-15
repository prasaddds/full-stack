const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/hello2")
.then(()=>{
    console.log("Connection success");
})
.catch((err)=>{
    console.log(err);
})