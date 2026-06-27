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
            .eq('subject', subject.toLowerCase())
            .order('id', {ascending: true})

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
                    onClick={()=>navigate(`/wave/${subject}?chapter=${chapter}`)}>
                    {chapter}
                </button>
            ))}
             <button onClick={()=>navigate('/subject')} style={{marginTop:'20px', display:"block"}}>back</button>
        </div>
    );
}

export default ChapterSelect;