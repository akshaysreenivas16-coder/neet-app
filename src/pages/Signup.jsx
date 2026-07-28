import { Link, useNavigate } from "react-router-dom";
import { useState} from "react";
import supabase from "../supabase";

function Signup(){

    const [email, setEmail] = useState("")
    const [password, setpassword] = useState("")
    const [message, setMessage] = useState("")
    const navigate = useNavigate()

    async function handleSignup() {

        if(password.length < 8){
        setMessage("Password must be at least 8 characters")
        return
        }

        const {data, error}= await supabase.auth.signUp({
            email: email,
            password : password
        })


        if(error){
            setMessage(error.message)
        }else{
            navigate('/profile-setup')
        }
        
    } 


    async function handleGoogleLogin(){
        const {error} = await supabase.auth.signInWithOAuth({
            provider : 'google',
            options : {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        })
        if(error)
        setMessage(error.message)
    }


    return( 

        <>

        <div className="min-h-screen bg-[#cae9ff] flex items-center justify-center px-2 pb-20">
            <div  className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-[#1b4965] mb-2">Create Account</h1>
                <p className="text-center text-gray-500 mb-10">your NEET prep starts here</p>
                <input type="email" 
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-1 focus:ring-[#5fa8d3]"
                />

                <input type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-1 focus:ring-[#5fa8d3]"
                />
                {message && <p className="text-center text-red-500 text-sm mb-4">{message}</p>}

                <button 
                    onClick={handleSignup}
                    className="w-full bg-[#1b4965] text-white py-3 rounded-lg font-semibold hover:bg-[#0d1b2a] transition mb-3">
                    Sign up
                </button>

                <button 
                    onClick={handleGoogleLogin}
                    className="w-full border-2 border-[#5fa8d3] text-[#1b4965] py-3 rounded-lg font-semibold hover:bg-[#cae9ff] transition mb-6">
                    Continue with Google
                </button>
                <p className="text-center text-sm">
                    Already have an Account?{' '}
                        <Link to="/" className="text-[#62b6cb] font-semibold hover:underline">
                            Login
                        </Link>
                </p>
               

            </div>
        </div>
        </>
    );
}

export default Signup;