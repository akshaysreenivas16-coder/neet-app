import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Atom } from "react-loading-indicators";
import supabase from "../supabase";

function AuthCallback(){
    const navigate = useNavigate()

    useEffect(()=>{
        async function handleCallback() {
            const {data, error} = await supabase.auth.getSession()

            if(error || !data.session){
                //try exchanging the hash token
                const {data : {session}, error : sessionError} = await supabase.auth.exchangeCodeForSession(window.location.hash)
                if(sessionError || !session){
                    navigate('/')
                    return
                }
            }
            
            const user = data.session?.user || session?.user

            const {data: profile} = await supabase
                .from('profiles')
                .select('id')
                .eq('id', user.id)
                .maybeSingle()

            if(profile){
                navigate('/subject')
            }else{
                navigate('/profile-setup')
            }

        }
        handleCallback()
    },[])

    return (
        <div className="min-h-screen bg-[#cae9ff] flex items-center justify-center">
            <Atom  color="#1b4965" size="medium"/>
        </div>
    )

}

export default AuthCallback