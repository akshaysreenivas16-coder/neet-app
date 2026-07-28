import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Atom } from "react-loading-indicators";
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

    if(loading) return (
        <div className="bg-[#cae9ff] min-h-screen mx-auto flex items-center justify-center">
            <Atom color="#1b4965" size="medium"/>
        </div>
    )
    
    return(
        <div className="bg-[#cae9ff] min-h-screen px-2 py-6">
            <div className="bg-white p-4 rounded-2xl max-w-md mx-auto">
                <h1 className="text-xl font-bold text-[#1b4965] text-center mb-4">My profile</h1>
                <div className="flex justify-center mb-4">
                    <p className="bg-[#bee9e8] w-24 h-24 rounded-full flex items-center justify-center text-5xl ring-2 ring-[#62b6cb] font-bold text-white shadow-lg m-5">
                        {profile?.name.charAt(0).toUpperCase()}
                    </p>
                </div>
                <div className="p-3 rounded-2xl flex flex-col gap-2 border-2 border-[#cae9ff]">
                    <p className="bg-[#bee9e8] flex justify-between border-1 p-2 rounded-xl border-[#5fa8d3] ">
                        <span>Name :</span> 
                        {profile?.name}
                    </p>
                    <p className="flex justify-between border-1 p-2 rounded-xl border-[#5fa8d3]">
                        <span>Username:</span> 
                        {profile?.username}
                    </p>
                    <p className="flex justify-between border-1 p-2 rounded-xl border-[#5fa8d3]">
                        <span>Age:</span> 
                        {profile?.age}
                    </p>
                </div>
                <button
                    className="w-full mb-4 bg-red-500 text-white rounded-xl py-3 mt-6 hover:bg-red-600 transition" 
                    onClick={handleLogout}>
                        Logout
                </button> 
            </div>
        </div>
    )
}

export default Profile