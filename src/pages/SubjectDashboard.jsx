import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../supabase";

function SubjectDashboard(){
    const navigate =  useNavigate()
    const {subject} = useParams()
    const [user, setuser] =  useState(null)
    const [chapters, setChapters] = useState([])


    useEffect(()=>{
        async function fetchChapters(){
        const {data: {user}} = await supabase.auth.getUser()
        if(!user) return
            const {data} = await supabase
                .from('user_progress')
                .select('*')
                .eq('user_id' , user.id)
                .eq('subject', subject)
            setChapters(data)
        }
    fetchChapters()
    },[subject])

    function getColor(accuracy){
        if (accuracy >= 80) return 'green'
        if (accuracy >= 50) return 'orange'
        return 'red'
    }

    function getLabel(accuracy){
        if (accuracy >= 80) return 'Strong 💪'
        if (accuracy >= 50) return 'Needs work 📚'
        return 'weak ⚠️'
    }

    return(
        <div>
            <h1>{subject} - Chapter Progress</h1>
            {chapters.length === 0
            ?<p>Not practiced yet.</p>
            : chapters.map(row =>(
                <div    
                    key={row.chapter}
                    style={{
                        padding: '15px',
                        margin: '10px 0',
                        border: '1px solid #ccc',
                        borderRadius: '10px',
                        borderLeft: `5px solid ${getColor(row.accuracy)}`
                    }}>
                        <h3>{row.chapter}</h3>
                        <p style={{ color:'grey', fontSize: '14px'}}>
                            {Math.round(row.accuracy)}% accuracy - {getLabel(row.accuracy)}
                        </p>
                </div>
            ))
            }
        <button onClick={()=>navigate('/dashboard')}>back to Dashboard</button>
        </div>
    )
}
export default SubjectDashboard;