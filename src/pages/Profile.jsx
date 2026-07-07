import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabase";

function Profile(){
    const [profile, setProfile] = useState("")
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(()=>{
        async function fectchProfile(){
            const {data:{user}} = await supabase.auth.getUser()
            if(!user) return

            const {data}= await supabase
                .from('profiles')
                .select("*")
                .eq('id', user.id)
                .single()

            setProfile(data)
            setLoading(false)
        }
        fectchProfile()  
    },[])

     //logout
    async function handleLogout(){
        await supabase.auth.signOut()
        navigate("/")
    }

    if(loading) return <p>Loading..</p>
    return(
        <div>
            <h1>My profile</h1>
            <p>Name : {profile?.name}</p>
            <p>Username: {profile?.username}</p>
            <p>Age: {profile?.age}</p>
            <button onClick={() => navigate('/home')}>Back to Home</button>

            <button onClick={handleLogout} style={{display:"block", marginTop:"20px"}}>Logout</button> 
        </div>
    )
}

export default Profile