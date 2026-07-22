import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { X } from "lucide-react"
import supabase from "../supabase";

function SubjectDashboard(){
    const navigate =  useNavigate()
    const {subject} = useParams()
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
        if (accuracy >= 70) return 'green'
        if (accuracy >= 50) return 'orange'
        return 'red'
    }

    function getLabel(accuracy){
        if (accuracy >= 70) return 'Strong 💪'
        if (accuracy >= 50) return 'Needs work 📚'
        return 'weak ⚠️'
    }

    return(
        <div className="bg-[#cae9ff] min-h-screen px-2 py-6">
            <div className="bg-white p-3 rounded-2xl max-w-md mx-auto">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-lg font-bold text-[#1b4965]">{subject} - Chapter Progress</h1>
                    <button onClick={()=>navigate('/dashboard')}>
                        < X size={24} />
                    </button>
                </div>
                {chapters.length === 0
                ?<p className="text-gray-400 text-center py-10">Not practiced yet.</p>
                : chapters.map(row =>(
                    <div    
                        key={row.chapter}
                        className="border border-gray-200 p-4 mb-3 rounded-2xl flex items-center justify-between"
                        style={{
                            borderLeft: `5px solid ${getColor(row.accuracy)}`
                            }}>
                            <div>
                                <h3 className="font-bold text-[#1b4965]">{row.chapter}</h3>
                                <p className="text-gray-500 text-sm"> {getLabel(row.accuracy)}</p>
                            </div>
                            <p className="font-bold text-[#1b4965]">{Math.round(row.accuracy)}% accuracy</p>
                    </div>
                ))
                }
            </div>
        </div>
        
    )
}
export default SubjectDashboard;