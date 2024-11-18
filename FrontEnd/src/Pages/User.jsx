import React, { useEffect, useState } from 'react'
import axios from 'axios';
export default function User() {
  const [usersData, setusersData] = useState([]);
const [filterUserData,setFilterUserData]= useState([]);
const [searchText, setSearchText] = useState('');
  const getUser = async () => {
    try {
      const res = await axios.get('http://localhost:3003/api/users/get');
      setusersData(res.data.UsersData);
    setFilterUserData(res.data.UsersData);
    }
    catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getUser();
  },[]);

  const handlechange = (e)=>{
    const searchValue = e.target.value;
    if(searchValue.trim()===''){
    }
    setSearchText(searchValue);

   const filterData = usersData.filter((item)=>item.name.toLowerCase().includes(searchText.toLowerCase()));
    setFilterUserData(filterData);
    console.log(filterUserData);
  }

  return (
    <>
      <div className='container'>
        <input type="text" placeholder='Search' name='name' onChange={handlechange}/>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>age</th>
            </tr>
          </thead>
          <tbody>
             {filterUserData.map((user,index)=>(
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.age}</td>
                </tr>
             ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
