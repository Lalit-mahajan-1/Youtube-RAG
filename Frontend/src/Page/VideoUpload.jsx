import axios from 'axios';
import React, { useState } from 'react'

const VideoUpload = ({prop}) => {
 const [videourl,Setvideourl] = useState('');
 const handlechange = (e) =>{
       Setvideourl(e.target.value);
 }
 const handleSubmit = async (e) =>{
  e.preventDefault();
  try{
      const res = await axios.post(`${import.meta.env.VITE_ML_API}/url`,{
        URL: videourl,
        Id : prop
      },{ withCredentials: true });

  }
  catch(error){
     console.log(error);
  }
 }
  return (
    <div>
          <form onSubmit={handleSubmit}>
          <label htmlFor="video-url">Enter Video URL: </label><br />
          <input
            type="text"
            name="video-url"
            value = {videourl}
            onChange={handlechange}
            placeholder="enter video url"
          />
        <button type='submit'>submit</button>
          </form>
    </div>
  )
}

export default VideoUpload
