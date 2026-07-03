import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import supabase from "../supabase";

function Login(){
    const [email, setEmail]= useState("")
    const [password, setpassword]= useState("")
    const [message, setMessage]= useState("")
    const navigate=useNavigate()

    async function handleLogin(){
        const {data, error} = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })

        if(error){
            setMessage(error.message)
        }else{
            const {data:profile} = await supabase
                .from('profiles')
                .select('id')
                .eq('id', data.user.id)
                .maybeSingle()
            
            if (profile){
                navigate('/home')
            }else{
                navigate('/profile-setup')
            }
            
        }

    }

    async function handleGoogleLogin() {
        const{error} = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options : {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        })
        if (error) setMessage(error.message)
    }

    return(
        <>
        <div>
            <h1>Log in</h1>
            <input type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
            />

               <input type="password"
                placeholder="Enter your passsword"
                value={password}
                onChange={(e)=>setpassword(e.target.value)}
            />

            <button onClick={handleLogin}>
                Login
            </button>

            <button onClick={handleGoogleLogin}>
                Continue with Google
            </button>

            {message && <p>{message}</p>}

        </div>

        <Link to="/signup">don't have an Account? Sign up</Link>

        </>

    )
}

export default Login;