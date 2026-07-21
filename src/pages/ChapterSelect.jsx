import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import supabase from "../supabase";
import { X } from "lucide-react"

function ChapterSelect(){
    const navigate = useNavigate()
    const {subject} = useParams()
    const [chapters, setChapters] = useState([])

    useEffect(()=>{
        const fetchChapters = async()=>{
            const {data} = await supabase
            .from('questions')
            .select('chapter')
            .eq('subject', subject.toLowerCase())
            .order('id', {ascending: true})

        const unique = [...new Set(data.map(row =>row.chapter))]
        setChapters(unique)
        }
    fetchChapters()
    },[subject])

   
return(
        <div className="min-h-screen bg-[#bee9e8] px-6 py-8"> 
            <div className="bg-white p-3 rounded-2xl max-w-md mx-auto">
                <div className="flex items-center justify-between pb-5  max-w-md mx-auto">
                    <h1 className="text-lg font-bold text-[#1b4965]">{subject.toUpperCase()} - SELECT CHAPTER</h1>
                    <button onClick={()=>navigate('/subject')}><X size={26} /></button>
                </div>
                <div className="space-y-1.5 max-w-md mx-auto">
                    {chapters.map((chapter)=>(
                        <button
                            key={chapter}
                            onClick={()=>navigate(`/wave/${subject}?chapter=${chapter}`)}
                            className="bg-white rounded-2xl p-5 w-full text-[#1b4965] font-bold ring-2 ring-[#5fa8d3]/30 hover:bg-[#cae9ff] transition text-base text-left min-h-[64px] items-center">
                            {chapter}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ChapterSelect;