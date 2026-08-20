import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { X } from "lucide-react"
import { Atom } from 'react-loading-indicators'
import supabase from "../supabase";

function WaveSelect(){
    const navigate = useNavigate()
    const {subject} =  useParams()
    const [searchParams] = useSearchParams()
    const chapter = searchParams.get('chapter')
    const [totalQuestions, setTotalQuestion] =  useState(0)
    const [loading , setLoading] = useState(true)
    const [waveProgress, setWaveProgress] =  useState([])

    useEffect(()=>{
        async function fetchData() {
            const{ data: questions} = await supabase
                .from('questions')
                .select('id')
                .eq('subject', subject.toLowerCase())
                .eq('chapter', chapter)
    
            setTotalQuestion(questions.length)
            
            const {data : {user} } = await supabase.auth.getUser()

            const { data : progress } = await supabase
                .from('wave_progress')
                .select('*')
                .eq('user_id', user.id)
                .eq('subject', subject)
                .eq('chapter', chapter)

            setWaveProgress(progress || [])    
            setLoading(false) 
        }
        fetchData()
    },[subject, chapter])

    function getWaveRanges(){
        const perWave = 10 
        const numWave = Math.ceil( totalQuestions / perWave )
        const ranges = []

        for ( let i = 0; i < numWave; i++ ){
            const from = i * perWave
            const to = Math.min( from + perWave , totalQuestions)
            ranges.push({wave: i + 1, from, to })
        }
        return ranges
    }


   if(loading) return (
        <div className="bg-[#cae9ff] min-h-screen mx-auto flex items-center justify-center">
            <Atom color="#1b4965" size="medium"/>
        </div>
    )
    return(
        <div className="bg-[#cae9ff] min-h-screen px-2 py-6">
            <div className="max-w-md mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <p className="text-sm text-gray-400 upercase tracking-widest">{subject}</p>
                        <h1 className="text-[#1b4965] text-lg font-bold">{chapter}</h1>
                    </div>
                    <button onClick={()=>navigate(`/chapters/${subject}`)}>
                        <X size={24}  className="text-[#1b4965]"/>
                    </button>
                </div>
                <hr className="mb-15 bg-[#1b4965]"></hr>

                {/* Wave map */}  
                <div className="relative flex flex-col items-center gap-6">
                    {getWaveRanges().map(({wave, from, to})=>{
                        const progress = waveProgress?.find( p=> p.wave_number === wave)
                        const isCompleted = progress?.completed || false
                        const stars = progress?.stars || 0 
                        const islocked = wave > 1 && !waveProgress.find(p => p.wave_number === wave - 1)?.completed
                    
                        const position = wave % 2 === 0 ? 'self-end mr-8' : 'self-start ml-8'
                        
                        return(
                            <div key={wave} className={`relative flex flex-col items-center ${position} z-10`}>
                                
                                {/* Bubble */}
                                <button 
                                    onClick={() =>
                                    !islocked && navigate(`/practice?subject=${subject}&chapter=${chapter}&wave=${wave}&from=${from}&to=${to}`)}
                                    className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg text-white font-bold text-lg transition
                                        ${islocked?'bg-[#94a3b8] cursor-not-allowed': isCompleted ? 'bg-[#62b6cb]': 'bg-[#1b4965]'}`}>
                                {islocked? '🔒' : wave }
                                </button>

                                {/* Stars */}
                                <div className="absolute -top-3 w-20 h-20 pointer-events-none">
                                    {/* Left star */}
                                    <span className={`absolute text-lg ${1 <= stars? 'opacity-100' : 'opacity-20'}`}
                                        style={{top: '-1px', left: '-10px'}}>⭐</span>
                                    {/* Middle star */}
                                    <span className={`absolute text-lg ${2 <= stars? 'opacity-100' : 'opacity-20'}`}
                                        style={{top: '-15px', left: '50%', transform: 'translateX(-50%)'}}>⭐</span>
                                    {/* Right star */}
                                    <span className={`absolute text-lg ${3 <= stars? 'opacity-100' : 'opacity-20'}`}
                                        style={{top: '-1px', right: '-10px'}}>⭐</span>
                                </div> 

                                <p className="text-xs font-semibold text-[#1b4965]/60 mt-1">wave {wave}</p>

                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
export default WaveSelect