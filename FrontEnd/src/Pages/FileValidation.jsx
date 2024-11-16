import React, { useState } from 'react'

function FileValidation() {

const [image,setImage] = useState('')
const handleSubmit =(e)=>{
e.preventDefault();

const formData = new FormData();
formData.append("name",e.target.name.value);
formData.append("image",image);

const obj = Object.fromEntries(formData.entries());
console.log(obj);
}
const handleImageChange = (e)=>{
    
setImage(e.target.files[0])
}
  return (
    <div>
        <form onSubmit={handleSubmit}>
            Name:<input type='text' name='name' />
            Image:<input type='file' name='image' onChange={handleImageChange} />
            <button>Save</button>
        </form>
    </div>
  )
}

export default FileValidation