const mongoose = require('mongoose');
const express = require('express')
const bodyParser = require('body-parser');
//for image upload
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const cors = require('cors');
const mongodbURL = 'mongodb://localhost:27017/FileUploadByMulter';
const app = express();
app.use(bodyParser.json())
app.use(cors());

mongoose.connect(mongodbURL)
.then(()=>console.log("database connected successfully"))
.catch((err)=>console.log("db Not connected"));

//create uploads dr if its dosn't exist
const uploadDir = path.join(__dirname,'uploads');
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir,{recursive:true});
}
app.use('/uploads',express.static(uploadDir));

//configure multer
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, uploadDir);
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+'_'+file.originalname);
    }
})
const upload = multer({storage:storage});
//=====================================================
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

app.post('/user/signup',upload.single('image'), async(req,res)=>{
    try{
 const {name} = req.body;
 const imagepath = req.file ? req.file.path : 'Image';
 if (!name || !imagepath) {
    return res.status(400).json({ message: 'Enter all required data' });
}
    const newuser = new user({name,image:imagepath});
 const newuserData = await newuser.save();
 res.status(200).json({message:'Data save successfully!',user:newuserData})
    }
    catch(err){
        res.status(200).json({message:'Data save successfully!',Error:err})
    }
})

app.get('/user/get', async(req,res)=>{
    try{
     const getuser = await user.find();
     if(!getuser){
        res.status(200).json({message:'user data not fond'});
     }
     res.status(200).json({message:'user data fetch successfull',user:getuser});
    }
    catch(err){
        res.status(500).json({message:'Bad request'});
    }
})


app.listen(3000,()=>{
    console.log("server is running on port 3000");
})