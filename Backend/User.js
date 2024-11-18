const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.json());

//connect to mongodb
const dbURL = 'mongodb://localhost:27017/FileUploadByMulter'
mongoose.connect(dbURL)
    .then(() => console.log('db connected'))
    .catch((err) => console.log('db not connected'))

//user schema
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    }
})

//user model
const UserModel = mongoose.model('userModel', userSchema);

//post api for user

app.post('/api/users/post', async (req, res) => {
    try {
        const { name, email, age } = req.body;
        if (!name || !email || !age || name == '' || email == '' || age == '') {
            res.status(400).json({ message: 'Please fill the field correctly' })
        }
        if (name && email && age) {
            const newUser = new UserModel({
                name, email, age
            })
            const newUserData = await newUser.save();
            res.status(201).json({ message: `${name} Your Data save successfully`, userData: newUserData });
        }
    }
    catch (err) {
        res.status(500).json({ message: ' Data not save successfully', Error: err });

    }
})
//get all users
app.get('/api/users/get', async (req, res) => {
    try {
        const UsersData = await UserModel.find()
        if (UsersData) {
            return res.status(200).json({ message: 'UsersData fetch successfully', UsersData });
        }
        res.status(400).json({ message: 'Bad Request ' });

    }
    catch (err) {
        res.status(500).json({ message: 'Internal Error', Error: err });
    }
})
//delete api
app.delete('/api/delete/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ message: 'bad request' });
        }
        const originalId = await UserModel.findByIdAndDelete(userId);
        if(!originalId){
            return res.status(400).json({message:'user not fond'});
        }
        res.status(201).json({message:`User ${userId} deleted successfully`});
    }
    catch(err) {
        res.status(500).json({message:`Internal server error`,Error:err});
    }
})



app.listen(3003, () => {
    console.log('server is running on port 3003');
})