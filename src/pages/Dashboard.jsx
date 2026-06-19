import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabase";

function Dashboard(){
    const navigate = useNavigate()
    const [progress, setProgress] = useState([])
    const subjects = ["Biology", "Chemistry", "Physics"]


    useEffect(()=>{
        async function fetchProgress(){
            const {data: {user} } = await supabase.auth.getUser()
            if(!user) return
            const {data} = await supabase
                .from('user_progress')
                .select('*')
                .eq('user_id', user.id)
            setProgress(data)
        }
        fetchProgress()
    },[])

    function getSubjectAccuracy(subject){
        const rows = progress.filter(row => row.subject.toLowerCase() === subject.toLowerCase())
        if (rows.length === 0) return null
        const total = rows.reduce((sum, row)=> sum + row.accuracy,0)
        return Math.round(total/rows.length)
    }

    function getColor(accuracy){
        if(accuracy >=70) return 'green' 
        if(accuracy >=50) return 'orange'
        return 'red' 
    }
    return(
        <div>
            <h1>Dashboard</h1>
            <div style={{ display:'flex', gap:'20px'}}>
            {subjects.map(subject=>{
                const accuracy = getSubjectAccuracy(subject)
                return(
                    <div
                        key={subject}
                        onClick={()=> navigate(`/dashboard/${subject}`)}
                        style={{
                            padding: '20px',
                            border: '1px solid #ccc',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            borderLeft: `5px solid ${accuracy? getColor(accuracy): 'grey'}`
                        }}>
                        <h2>{subject}</h2>  
                        {accuracy !== null 
                        ? <p style={{color: getColor(accuracy)}}>{accuracy}% accuracy</p> 
                        : <p style={{color: 'grey'}}>Not started</p>}              
                    </div>
                )
            })}
            </div>
            <button onClick={()=>navigate('/home')} style={{marginTop:'20px'}}>back to home</button>
        </div>
    )
}
export default Dashboard