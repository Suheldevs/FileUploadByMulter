import React, { useState } from 'react'
import axios from 'axios'
function App() {
  const [formData,setFormData]=useState({
    name:'',
    image:null
  })
const handleChange=(e)=>{
  const {name,value} = e.target;
  setFormData({...formData,[name]:value});
}
const handleSubmit= async(e)=>{
console.log(formData);
const newFormData = new FormData();
newFormData.append("name",formData.name);
newFormData.append("image",formData.image);

try{
  const response = await axios.post('http://localhost:3000/user/signup',newFormData);
  console.log(response);
}
catch(err){
console.log(err);
}
}
const handleImageChange = (e)=>{
  const file = e.target.files[0];
  setFormData({
    ...formData,
    image:file
  })
}



  return (
    <div>
      <form>
        Name:<input type='text' name='name' value={formData.name} onChange={handleChange}/>
        image:<input type='file' name='image' onChange={handleImageChange}/>
        <button onClick={handleSubmit} type='reset'>Submit</button>
      </form>
    </div>
  )
}

export default App