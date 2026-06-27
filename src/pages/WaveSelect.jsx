import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import supabase from "../supabase";

function WaveSelect(){
    const navigate = useNavigate()
    const {subject} =  useParams()
    const [searchParams] = useSearchParams()
    const chapter = searchParams.get('chapter')
    const [totalQuestions, setTotalQuestion] =  useState(0)
    const [loading , setLoading] = useState(true)

    useEffect(()=>{
        async function fetchCount() {
            const{data} = await supabase
                .from('questions')
                .select('id')
                .eq('subject', subject.toLowerCase())
                .eq('chapter', chapter)
    
            setTotalQuestion(data.length)
            setLoading(false) 
        }
        fetchCount()
    },[subject, chapter])

    function getWaveRanges(){
        const wave = 3
        const perWave = Math.ceil(totalQuestions/wave)
        return [
            {wave : 1, from:0, to: perWave},
            {wave : 2, from:perWave, to: perWave *2},
            {wave : 3, from:perWave*2, to: totalQuestions},
        ]
    }

    if(loading) return <p>Loading...</p>

    return(
        <div>
            <h1>{chapter}</h1>
            <p>select a wave to Practice</p>
            {getWaveRanges().map(({ wave, from, to })=>(
                <button key={wave} onClick={()=>navigate(`/practice?subject=${subject}&chapter=${chapter}&wave=${wave}&from=${from}&to=${to}`)}>
                wave {wave} ({to - from} questions)
                </button>
            ))}
             <button onClick={() => navigate(`/chapters/${subject}`)}>Back</button>
        </div>
    )
}
export default WaveSelect