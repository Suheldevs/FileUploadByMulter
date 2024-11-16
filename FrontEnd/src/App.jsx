import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Products from './Pages/Products';
import FileValidation from './Pages/FileValidation';
function App() {
  const [data,setData]=useState([]);
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
  // console.log(response);
  fetchData();
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

//get data from db

const fetchData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/user/get');
    setData(response.data.user);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
useEffect(() => {

  fetchData();

}, []);
  return (
    <div>
      <form>
        Name:<input type='text' name='name' value={formData.name} onChange={handleChange}/>
        image:<input type='file' name='image' onChange={handleImageChange}/>
        <button onClick={handleSubmit} type='reset'>Submit</button>
      </form>
      <div style={{margin:'20px'}}>
        {data.map((item,i)=>(
          <div key={i}>
            <div>{item.name}</div>
            <div><img src={`http://localhost:3000/${item.image}`} height={'200px'}/></div>
          </div>
        ))}
      </div>
      <Products/>
      <FileValidation/>
    </div>
  )
}

export default App