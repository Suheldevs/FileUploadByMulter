import React, { useState } from 'react'

function FileValidation() {

const [image,setImage] = useState('')
const [error, setError] = useState(null);
const handleSubmit =(e)=>{
e.preventDefault();

const formData = new FormData();
formData.append("name",e.target.name.value);
formData.append("image",image);

const obj = Object.fromEntries(formData.entries());
console.log(obj);
}
const handleImageChange = (e)=>{
setError('')
// setImage(e.target.files[0])

//for errorhanding and file validation
const selectedFile = e.target.files[0];
const allowTypes =['image/jpeg','image/png','image/jpg','image/gif'];
if(!allowTypes.includes(selectedFile.type)){
    setError('Only jpg,png,jpeg and gif file is allowed!');
    return;
} 

const allowSize = 1*1024*1024;
if(selectedFile.size > allowSize){
    setError('File size must be 1 MB')
    return;
}

const img = new Image();
img.onload = ()=>{
    const width = img.width;
    const height = img.height;
    const maxWidth = 200;
    const maxHeight = 200;

    if(width>maxWidth || height>maxHeight){
        setError(`Image dimensions must be less than ${maxWidth}x${maxHeight}.`);
    }
    else{
        setImage(selectedFile);
    }
};
img.src = URL.createObjectURL(selectedFile);



}
  return (
    <div>
        <form onSubmit={handleSubmit}>
            Name:<input type='text' name='name' />
            Image:<input type='file' name='image' onChange={handleImageChange} />
            {error && <p>{error}</p> }
            <button>Save</button>
        </form>
    </div>
  )
}

export default FileValidation