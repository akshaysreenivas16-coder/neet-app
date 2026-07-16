import { useNavigate, useLocation} from "react-router-dom";
import { useEffect, useState } from "react";
import { BookText, ChartPie, ClipboardPenLine , Trophy } from 'lucide-react'
import supabase from "../supabase";

function Navbar(){
    const navigate = useNavigate()
    const location = useLocation()
    const [name, setName] = useState("")
    const [streak, setStreak] = useState(0) 

    useEffect(()=>{
        async function fetchName(){
            const {data: {user}} = await supabase.auth.getUser()
            if (!user) return

            const{data: streakData} = await supabase
                .from('user_streaks')
                .select('current_streak')
                .eq('user_id', user.id).single() 
            if(streakData) setStreak(streakData.current_streak)

            const {data} = await supabase
                .from('profiles')
                .select('name')
                .eq('id', user.id)
                .single()
            if(data)
            setName(data.name)
        }
        fetchName()
    },[])

    return(
        <div>
            {/* Top bar */}
            <div className="bg-[#1b4965] flex justify-between items-center px-6 py-4">
                {/* Left - app name */}
                <p className="text-white text-xl font-bold cursor-pointer"
                    onClick={()=>navigate('/home')}>
                    Neetly
                </p>
                <div className="flex items-center gap-6">
                    {/* Desktop Links*/}
                    <div className=" hidden md:flex gap-6">
                        <button onClick={()=>navigate('/subject')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                            location.pathname.startsWith('/subject') || location.pathname.startsWith('/chapters') || location.pathname.startsWith('/wave')
                            ? 'bg-[#bee9e8] text-[#1b4965]'
                            : 'text-white hover:bg-[#bee9e8]/30'
                        }`}>
                            <BookText size={16}/>
                            Practice
                        </button>
                        <button onClick={()=>navigate('/dashboard')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                            location.pathname.startsWith('/dashboard')
                            ? 'bg-[#bee9e8] text-[#1b4965]'
                            : 'text-white hover:bg-[#bee9e8]/30'}`
                            }>
                                <ChartPie size={16}/>
                                Dashboard</button>
                        <button onClick={()=>navigate('/weekly-test')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                            location.pathname.startsWith('/weekly-test')
                            ? 'bg-[#bee9e8] text-[#1b4965]'
                            : 'text-white hover:bg-[#bee9e8]/30'
                        }`}>
                            <ClipboardPenLine size={16}/>
                            Weekly Test</button>
                        <button onClick={()=>navigate('/leaderboard')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                            location.pathname.startsWith('/leaderboard')
                            ? 'bg-[#bee9e8] text-[#1b4965]'
                            : 'text-white hover:bg-[#bee9e8]/30'
                        } `}>
                            <Trophy size={16}/>
                            Leaderboard</button>
                        <span className="text-[#fb8b24] font-bold">🔥 {streak}</span>
                    </div>
                    {/* Right - greeetings + profile icon*/}
                    <div className="flex items-center gap-3">
                        <span className="text-[#fb8b24] font-bold text-sm md:hidden">🔥 {streak}</span>
                        <button 
                            onClick={()=> navigate('/profile')}
                            className="flex items-center gap-3 bg-[#62b6cb] text-white pl-5 px-2 py-2 rounded-full text-sm font-semibold hover:bg-[#5fa8d3] transition">
                                <span>Hi, {name}</span>
                                <span className="bg-white text-[#1b4965] rounded-full w-7 h-7 flex items-center justify-center">
                                    {name.charAt(0).toUpperCase()}
                                </span>
                        </button>
                    </div>
                </div>
            </div>
            {/* Bottom bar - mobile only */}
                <div className="fixed bottom-0 right-0 left-0 bg-[#1b4965] flex justify-around items-center py-3 md:hidden">
                    <button 
                        onClick={()=>navigate('/subject')}
                        className={`flex flex-col items-center text-xs gap-1 ${
                            location.pathname === '/subject' || location.pathname.startsWith('/chapters') || location.pathname.startsWith('/wave') || location.pathname.startsWith('/practice')
                            ? 'text-[#fb8b24]'
                            : 'text-white'
                        }`}>
                          <BookText size={24}/>
                    </button>
                    <button 
                        onClick={()=>navigate('/dashboard')}
                        className={`p-2 rounded-xl transition ${
                            location.pathname.startsWith('/dashboard')
                            ? 'text-[#fb8b24]'
                            : 'text-white'
                        } `}>
                        <ChartPie size={24}/>
                    </button>
                    <button 
                        onClick={()=>navigate('/weekly-test')}
                        className={`p-2 rounded-xl transition ${
                            location.pathname.startsWith('/weekly-test')
                            ? 'text-[#fb8b24]'
                            : 'text-white'
                        }`}>
                        <ClipboardPenLine size={24}/>
                    </button>
                    <button 
                        onClick={()=>navigate('/leaderboard')}
                        className={`p-2 rounded-xl transition ${
                            location.pathname.startsWith('/leaderboard')
                            ? 'text-[#fb8b24]'
                            : 'text-white'
                        }`}>
                            <Trophy size={24}/>
                    </button>
                </div>
            <div>
            </div>
        </div>
    )

}

export default Navbar