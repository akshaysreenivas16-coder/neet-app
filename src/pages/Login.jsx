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
        <div className="min-h-screen bg-[#cae9ff] flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-[#1b4965] mb-2">Neetly</h1>
                <p className="text-center text-gray-500 mb-8">Login to continue</p>
                <input type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-1 focus:ring-[#5fa8d3]"
                />

                <input type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e)=>setpassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-1 focus:ring-[#5fa8d3]"
                />

                {message && <p className="text-red-500 text-sm mb-4 text-center">{message}</p>}

                <button 
                    onClick={handleLogin}
                    className="w-full bg-[#1b4965] text-white py-3 rounded-lg font-semibold hover:bg-[#0d1b2a] transition mb-3">
                    Login
                </button>

                <button 
                    onClick={handleGoogleLogin}
                    className="w-full border-2 border-[#5fa8d3] text-[#1b4965] py-3 rounded-lg font-semibold hover:bg-[#cae9ff] transition mb-6">
                    Continue with Google
                </button>

                <p className="text-center text-sm">
                    Don't have an account?{' '}
                        <Link to="/signup" className="text-[#62b6cb] font-semibold hover:underline">
                            Signup
                        </Link>
                </p>


            </div>
        </div>

       

        </>

    )
}

export default Login;