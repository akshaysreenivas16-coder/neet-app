import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Atom } from "react-loading-indicators";
import supabase from "../supabase";

function AuthCallback(){
    const navigate = useNavigate()

   useEffect(() => {
    async function handleCallback() {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
            navigate('/')
            return
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', session.user.id)
            .maybeSingle()

        if (profile) {
            navigate('/subject')
        } else {
            navigate('/profile-setup')
        }
    }
    handleCallback()
}, [])

    return (
        <div className="min-h-screen bg-[#cae9ff] flex items-center justify-center">
            <Atom  color="#1b4965" size="medium"/>
        </div>
    )

}

export default AuthCallback