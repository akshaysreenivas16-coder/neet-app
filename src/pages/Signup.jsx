import { Link, redirect } from "react-router-dom";
import { useState} from "react";
import supabase from "../supabase";

function Signup(){

    const [email, setEmail] = useState("")
    const [password, setpassword] = useState("")
    const [message, setMessage] = useState("")

    async function handleSignup() {
        const {data, error}= await supabase.auth.signUp({
            email: email,
            password : password
        })

        if(error){
            setMessage(error.message)
        }else{
            setMessage("Account created !, check your email to confirm")
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

        <h1>Sign up</h1>

        <div>
            <input type="email" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
            />

            <button onClick={handleSignup}>
                Sign up
            </button>

            <button onClick={handleGoogleLogin}>
                Continue with Google
            </button>

            {message && <p>{message}</p>}

        </div>

        <Link to="/">already have an Account? Login</Link>

        </>
    );
}

export default Signup;