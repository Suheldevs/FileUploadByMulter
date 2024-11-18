const mongoose = require('mongoose');
const express = require('express')
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

//middlewares
app.use(bodyParser.json());
app.use(cors());

//upload file creation
const uploadDir = path.join(__dirname,'videos');
if(!fs.existsSync('videos')){
    fs.mkdirSync(uploadDir,{recursive:true});
}

app.use('/videos',express.static(uploadDir));

//multer configuration
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,uploadDir);
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+'_'+file.originalname);
    }
});

const upload = multer({storage:storage});

//connect to mongodb
const url = 'mongodb://localhost:27017/FileUploadByMulter';
mongoose.connect(url)
.then(()=>console.log('db connected'))
.catch((err)=>console.log("db not coonected!"));

//schema
const videoSchema = mongoose.Schema({
    name:{
        type:String,
    },
    video:{
        type:String,
    }
})
//model
const videoMoodel = mongoose.model('videoModel',videoSchema);

//post api
app.post('/video/post',upload.single('video'),async(req,res)=>{
    try{
        const {name} = req.body;
        const videoPath = req.file ? req.file.filename : 'video';
        if(!videoPath){
            return res.status(400).json({message:'video not uploaded'});
        }
        if(!name){
            return res.status(400).json({message:'fill all the feilds'});
        }
        const newVideo = new videoMoodel({
            name,video:videoPath
        })
        await newVideo.save();
        res.status(201).json({message:`${name} data save successfully`,data:newVideo});
    }
    catch(err){
        res.status(500).json({message:'internal error!',Error:err});
    }
})

//get api
app.get('/video/get',async(req,res)=>{
    try{
        const response = await videoMoodel.find();
        if(!response){
            return res.status(400).json({message:"unsuccessfull!"});
        }
       res.status(200).json({message:'data fetch successfully',data:response});
    }
    catch(err){
        res.status(500).json({message:'data fetch not  successfully',Error:err});
    }
})

app.listen(3004,()=>{
    console.log('server is ruunning on port 3004');
})