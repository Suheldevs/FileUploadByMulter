const mongoose = require('mongoose');
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const mongodbURL = 'mongodb://localhost:27017/FileUploadByMulter';
const app = express();
app.use(bodyParser.json())
app.use(cors());

mongoose.connect(mongodbURL)
.then(()=>console.log("database connected successfully"))
.catch((err)=>console.log("db Not connected"));

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String
    }
})

const user = mongoose.model('user',userSchema);

app.post('/user/signup', async(req,res)=>{
    try{
 const userData = req.body;
 if(!userData){
    res.status(400).json({message:'Enter All Data '})
 }
    const newuser = new user(userData);
 const newuserData = await newuser.save();
 res.status(200).json({message:'Data save successfully!',user:newuserData})
    }
    catch(err){
        res.status(200).json({message:'Data save successfully!',Error:err})
    }
})



app.listen(3000,()=>{
    console.log("server is running on port 3000");
})