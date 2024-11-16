const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
const path = require('path');
const fs = require('fs')
const multer = require('multer');

//middlewares
app.use(bodyParser.json());
app.use(cors());


//create a file for upload images
const uploadDir = path.join(__dirname,'FileValidation');
if(!fs.existsSync('FileValidation')){
    fs.mkdirSync(uploadDir,{recursive:true});
};
app.use('FileValidation',express.static(uploadDir));

//multer configuration
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,uploadDir);
    },
    filename:(req,file,cd)=>{
        cb(null,Date.now()+'_'+file.originalname);
    }
});
const upload = multer({storaage:storage});


//db connection
const mongodbURL = 'mongodb://localhost:27017/FileUploadByMulter';
mongoose.connect(mongodbURL)
.then(()=>console.log("db connected successfully!"))
.catch((err)=>console.log(err));

//user Schema
const user2Schema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
    }
})

//create model

const user2Model = mongoose.model('user2Schema',user2Schema);

// post api

app.post('/api/user', upload.single('image'),async(req,res)=>{
    try{
        const {name} = req.body;
        const imagepath = req.file ? req.file.path:'null';
        if(!imagepath){
            res,status.json({message:'image upload unsuccessfull'});
        }
        if(!name){
            res.status(400).json({message:'all field required'});
        }
        const newUser = new user2Model({
            name,
            image:imagepath
        })
        await newUser.save();
        res.status(201).json({message:'Data save successfully',user:user2Model});
    }
    catch(err){
        res.status(500).json({message:'Failed',Error:err});
    }
})







app.listen(3002,()=>{
    console.log("server is running on port 3002");
})