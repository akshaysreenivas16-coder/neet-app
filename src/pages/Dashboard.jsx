import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CircleProgress from "../components/CircleProgress";
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
        <div className="bg-[#bee9e8] min-h-screen px-2 py-6">
            <div className="bg-white max-w-md mx-auto p-3 rounded-2xl">
                <h1 className="mb-3 text-center text-lg font-semibold text-[#1b4965]">Dashboard</h1>
                <div className="flex flex-col gap-4">
                    {subjects.map(subject=>{
                        const accuracy = getSubjectAccuracy(subject)
                        return(
                            <div
                                key={subject}
                                onClick={()=> navigate(`/dashboard/${subject}`)}
                                className="border border-gray-300 p-3 rounded-2xl cursor-pointer flex items-center justify-between hover:bg-[#cae9ff]/30 transition">
                                <div>
                                    {accuracy !== null
                                    ? <CircleProgress accuracy={accuracy}/>
                                    : <div className="w-18 h-18 rounded-full border-8 border-gray-200 flex items-center justify-center text-gray-400 text-xs">-</div>}
                                   
                                </div>
                                <div>
                                    <h2>{subject}</h2>
                                </div>  
                                <div>
                                {accuracy !== null 
                                ? <p style={{color: getColor(accuracy)}}>{accuracy}% accuracy</p> 
                                : <p style={{color: 'grey'}}>Not started</p>}    
                                </div>          
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
export default Dashboard
