import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import supabase from "../supabase";

function ChapterSelect(){
    const navigate = useNavigate()
    const {subject} = useParams()
    const [chapters, setChapters] = useState([])

    useEffect(()=>{
        const fetchChapters = async()=>{
            const {data} = await supabase
            .from('questions')
            .select('chapter')
            .eq('subject', subject)

             console.log('data:', data)
             console.log('subject:', subject)

        const unique = [...new Set(data.map(row =>row.chapter))]
        setChapters(unique)
        }
    fetchChapters()
    },[subject])

   
return(
        <div>
            <h1>{subject.toUpperCase()} - SELECT CHAPTER</h1>
            {chapters.map((chapter)=>(
                <button 
                    key={chapter}
                    onClick={()=>navigate(`/practice?subject=${subject}&chapter=${chapter}`)}>
                    {chapter}
                </button>
            ))}
        </div>
    );
}

export default ChapterSelect;