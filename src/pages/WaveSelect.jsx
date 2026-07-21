import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { X } from "lucide-react"
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
        <div className="bg-[#bee9e8] min-h-screen px-6 py-8 ">
            <div className="bg-white p-3 rounded-2xl max-w-md mx-auto">
                <div className="flex items-center justify-between max-w-md mx-auto pb-8">
                    <h1 className="text-[#1b4965] text-lg font-bold">{chapter}</h1>
                    <button onClick={()=>navigate(`/chapters/${subject}`)}>< X size={24}/></button>
                </div>
                <div className="max-w-md mx-auto space-y-1.5">
                    <p className="pb-3 text-[#1b4965] font-bold">Select a wave to Practice</p>
                    {getWaveRanges().map(({ wave, from, to })=>(
                        <button key={wave}
                        onClick={()=>navigate(`/practice?subject=${subject}&chapter=${chapter}&wave=${wave}&from=${from}&to=${to}`)}
                        className="bg-white flex rounded-2xl w-full p-4 text-[#1b4965] font-bold ring-2 ring-[#5fa8d3]/30 hover:bg-[#cae9ff] transition">
                        Wave {wave} - ({to - from} questions)
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default WaveSelect