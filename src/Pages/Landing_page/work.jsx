import "./work.css"
import React, {useState, useEffect} from "react";
import axios from "axios";
import TemplateCard from "./templatecard.jsx"
import { useNavigate } from "react-router-dom"

function work({icon,description,path}){

    const profession=description;
    const [users, setUsers]=useState([]);
    const [errors,setErrors]=useState('');
    const [loading, setLoading]=useState(false);

    const navigate = useNavigate();
    
 
    
    const staticImageBaseURL = 'http://localhost:8080/';
      const handleClick=async(e)=>{
      e.preventDefault();
      setErrors('');
      setUsers([]);
      setLoading(true);
    
      const professionArray=profession.split(',').map(p=>p.trim()).filter(p=>p !=='');
       
      try{
      const response=await axios.post("http://localhost:8080/workers/profession",{profession:professionArray})
      console.log(" response data:",response.data)
    const data=response.data
        // Assuming data is an array of users
        const usersWithImages = data.map(user => {
            const imagePath = user.profileImage;
            const fullImageURL = imagePath ? `${staticImageBaseURL}${imagePath.replace(/\\/g, '/')}` : 'https://via.placeholder.com/150';
            return { ...user, image: fullImageURL };
       } )
       console.log(usersWithImages[0].image);
    setUsers(usersWithImages);

    

    navigate('/', { state: { users: usersWithImages } });
      }
    catch(err){
        console.log('Error fetching Workers:',err);
        setErrors(err.response?.data?.error||'An Unexpected error occured');
    }
    finally{
        setLoading(false);
    }

        
    }

    return(
        
        <>
        <button onClick={handleClick} >
            <div className="work-box">
                <div className="work-icon">{icon}</div>
                <div className="work-description"><p>{description}</p></div>
            </div>
        </button>

       
    </>
        
    )
}
export default work;