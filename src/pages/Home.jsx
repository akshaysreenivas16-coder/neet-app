import { useNavigate } from "react-router-dom";
import { useEffect, useState} from "react";
import supabase from "../supabase";

function Home(){
    const navigate= useNavigate()
    const [streak, setStreak] = useState(0) 

    useEffect(()=>{
        async function fetchStreak(){
            const {data:{user}} = await supabase.auth.getUser()
            if(!user) return
            const {data} = await supabase.from('user_streaks')
                .select('current_streak')
                .eq('user_id', user.id)
                .single()
            if(data) setStreak(data.current_streak)
        }
    fetchStreak()
    },[])

    //logout
    async function handleLogout(){
        await supabase.auth.signOut()
        navigate("/")
    }

    return(
        <div>
            <h1>NEET Prep</h1>
            <p>{streak} day streak</p>
            <button onClick={()=>navigate('/subject')}>Start Practice</button>
            <button onClick={()=>navigate('/dashboard')}>Dashboard</button>
            <button onClick={() => navigate('/weekly-test')}>Weekly Test</button>
            <button onClick={() => navigate('/profile')}>My Profile</button>     
            <button onClick={handleLogout} style={{display:"block", marginTop:"20px"}}>Logout</button>   
           
        </div>
    ) 
}
export default Home