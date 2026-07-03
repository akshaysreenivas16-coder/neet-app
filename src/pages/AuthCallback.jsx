import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabase";

function AuthCallback(){
    const navigate = useNavigate()

    useEffect(()=>{
        async function handleCallback() {
            const {data:{user}} = await supabase.auth.getUser()
            if(!user) return

            const {data: profile} = await supabase
                .from('profiles')
                .select('id')
                .eq('id', user.id)
                .maybeSingle()

            if(profile){
                navigate('/home')
            }else{
                navigate('/profile-setup')
            }

        }
        handleCallback()
    },[])

    return <p>Loading...</p>
}

export default AuthCallback