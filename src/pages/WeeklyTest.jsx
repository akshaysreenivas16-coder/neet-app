import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Atom } from 'react-loading-indicators'
import supabase from "../supabase";

function WeeklyTest(){
     
    const navigate = useNavigate()
    const [week, setWeek] = useState([])
    const [progress, setProgress] = useState([])
    const [results, setResult] = useState([])
    const [loading, setLoading] = useState(true)
    const [user, setUSer] = useState(null)

    useEffect(()=>{
        async function fetchData(){
            const {data: {user}} = await supabase.auth.getUser()
            if(!user) return

            // fetch all weeks
            const {data: weekData} = await supabase
                .from('weekly_tests')
                .select('*')
                .order('week_number', {ascending: true})

            // fecth user's progress
            const {data: progressData} = await supabase
                .from('user_progress')
                .select('*')
                .eq('user_id', user.id)

            // fetch user's result
            const {data: resultsData} = await supabase
                .from('weekly_test_results')
                .select('*')
                .eq('user_id', user.id)

            setWeek(weekData || [])
            setProgress(progressData || [])
            setResult(resultsData || [])
            setLoading(false)

        }
        fetchData()
    },[])


    function getWeekStatus(week){

        const today =  new Date().toISOString().split('T')[0]
        const startDate = week.start_date
        const endDate = week.end_date

        // check if already taken 
        const result = results.find(r => r.week_number === week.week_number)
        if(result) return { status :'completed' , score: result.score , total: result.total}

        //check if its upcoming
        if(today < startDate) return {status : 'upcoming'}

        //check if expired
        if( today > endDate) return {status : 'expired'}

        //check accuracy gate
        const notReady = week.chapters.filter(chapter => {
            const row = progress.find(p => p.chapter === chapter)
            return !row || row.accuracy < 10
        })

        if (notReady.length > 0) {
            return { status: 'locked', reason: `Need 70%+ accuracy in: ${notReady.join(', ')}`}
        }

        return { status: 'unlocked'}

    }

    if(loading) return (
        <div className="bg-[#cae9ff] min-h-screen mx-auto flex items-center justify-center">
            <Atom color="#1b4965" size="medium"/>
        </div>
    )

    return(
        <div className="bg-[#cae9ff] min-h-screen px-2 py-6">
            <div className="bg-white p-3 rounded-2xl max-w-md mx-auto">
                <h1 className="text-lg font-bold text-center text-[#1b4965] mb-4">Weekly Tests</h1>
                {week.map(week => {
                    const { status, score, total, reason } = getWeekStatus(week)
                    return(
                        <div key={week.week_number} 
                        className={`border mb-2 p-4 rounded-2xl transition ${
                            status === 'expired' || status === 'upcoming' ? 'opacity-50 border-gray-200'
                            : status === 'completed' ? 'border-[#62b6cb] bg-[#bee9e8]/20'
                            : status === 'unlocked' ? 'border-[#1b4965] bg-white'
                            : 'border-red-200 bg-red-50'
                        }`}>
                            <h2 className="font-bold text-[#1b4965] mb-3">Week {week.week_number} - {week.subject}</h2>
                            <p className="font-semibold mb-3">Chapters: {week.chapters.join(', ')}</p>
                            <p className="">{week.start_date}  → {week.end_date}</p>

                            {status === 'completed' && (
                                <p className="text-green-600 font-bold flex text-sm justify-between"> ✓ Completed
                                <span>score: {score}/{total}</span>
                                </p>
                            )}

                            {status === 'locked' && (
                                <p className="text-red-500">🔒 {reason}</p>
                            )}

                            {status === 'upcoming' && (
                                <p className="text-gray-500 font-bold flex text-sm">⏳ Upcoming</p>
                            )}

                            {status === 'expired' && (
                                <p className="text-gray-500  font-bold flex text-sm">⌛ Expired</p>
                            )}

                            {status === 'unlocked' && (
                                <button
                                className="bg-[#1b4965] mt-2 text-white rounded-xl w-full py-2 text-sm font-semibold hover:bg-[#62b6cb]" 
                                onClick={() => navigate(`/weekly-test-exam?week=${week.week_number}`)}>
                                    Start Test
                                </button>
                            )} 

                        </div>
                    )
                })}
            </div>    
        </div>
    )
}

export default WeeklyTest;