const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());
//file handling
const multer = require('multer');
const path = require('path');
const fs = require('fs');

//create a uploads folder
const uploadDir = path.join(__dirname, 'ProductsData');
if (!fs.existsSync('ProductsData')) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

app.use('ProductsData', express.static(uploadDir));

//multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname);
    }
})

const upload = multer({ storage: storage });






//db connection
const mongodbURL = 'mongodb://localhost:27017/FileUploadByMulter';
mongoose.connect(mongodbURL)
    .then(() => console.log('connected!'))
    .catch((err) => console.log(err));

// =======================
// Schema of Products
const ProductsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    title: {
        type: String,
    },
    category: {
        type: String
    },
    description: {
        type: String
    },
    images: {
        type: Array
    }
})
//Schema end

//create a model for productsSchema
const Products = mongoose.model('Products', ProductsSchema);


///post api for product data
app.post('/products/registation', upload.array('images', 5), async (req, res) => {
    try {
        const { name, price, title, category, description } = req.body;
        if (!name || !price) {
            res.status(400).json({ message: 'Please enter All detailds' })
        }

        // file upload 
        const files = req.files;
        if (!files || files.length == 0) {
            res.status(400).json({ message: 'No files uploaded' });
        }
        const filePaths = files.map((item) => item.path);




        const newProducts = new Products({
            name, price, title, category, description,
            images: filePaths
        })
        console.log(newProducts.images);
        const newProductsData = await newProducts.save();
        res.status(201).json({ message: 'Data save successfully', ProductsData: newProductsData });
    }
    catch (err) {
        res.status(201).json({ message: 'Data save successfully',error:err });
    }
})


app.listen(3001, () => {
    console.log('Server is running on port 3001')
})