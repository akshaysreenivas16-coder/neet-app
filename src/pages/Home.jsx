import { useNavigate } from "react-router-dom";
import supabase from "../supabase";

function Home(){
    const navigate= useNavigate()

    //logout
    async function handleLogout(){
        await supabase.auth.signOut()
        navigate("/")
    }

    return(
        <div>
            <h1>NEET Prep</h1>
            <button onClick={()=>navigate('/subject')}>Start Practice</button>
            <button onClick={()=>navigate('/dashboard')}>Dashboard</button>
            <button onClick={handleLogout} style={{display:"block", marginTop:"20px"}}>Logout</button>
        </div>
    ) 
}
export default Home