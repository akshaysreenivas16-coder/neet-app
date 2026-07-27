import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Atom } from "react-loading-indicators";
import supabase from "../supabase";

function AuthCallback(){
    const navigate = useNavigate()

   useEffect(() => {
    setTimeout(async () => {
        const { data } = await supabase.auth.getSession()
        if (data.session) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', data.session.user.id)
                .maybeSingle()
            
            navigate(profile ? '/subject' : '/profile-setup')
        } else {
            navigate('/')
        }
    }, 2000)
}, [])

    return (
        <div className="min-h-screen bg-[#cae9ff] flex items-center justify-center">
            <Atom  color="#1b4965" size="medium"/>
        </div>
    )

}

export default AuthCallback