import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
        const today =  new Date()
        const startDate = new Date(week.start_date)
        const endDate = new Date(week.end_date)

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
            return !row || row.accuracy < 70
        })

        if (notReady.length > 0) {
            return { status: 'locked', reason: `Need 70%+ accuracy in: ${notReady.join(', ')}`}
        }

        return { status: 'unlocked'}
    }

    if(loading) return <p>Loading...</p>


    return(
        <div>
            <h1>Weekly Tests</h1>
            {week.map(week => {
                const { status, score, total, reason } = getWeekStatus(week)
                return(
                    <div key={week.week_number} style={{
                        padding: '15px',
                        margin: '10px 0',
                        border: '1px solid #ccc',
                        borderRadius: '10px',
                        opacity: status === 'expired' || status === 'upcoming' ? 0.5 : 1
                    }}>
                        <h2>Week {week.week_number} - {week.subject}</h2>
                        <p>Chapters: {week.chapters.join(', ')}</p>
                        <p>{week.start_date}  → {week.end_date}</p>

                        {status === 'completed' && (
                            <p style={{ color: 'green'}}> ✓ Completed - score: {score}/{total}</p>
                        )}

                        {status === 'locked' && (
                            <p style={{ color: 'red'}}>🔒 {reason}</p>
                        )}

                        {status === 'upcoming' && (
                            <p style ={{ color: 'gray'}}>⏳ Upcoming</p>
                        )}

                        {status === 'expired' && (
                            <p style ={{ color: 'gray'}}>⌛ Expired</p>
                        )}

                        {status === 'unlocked' && (
                            <button onClick={() => navigate(`/weekly-test-exam?week=${week.week_number}`)}>
                                Start Test
                            </button>
                        )} 

                    </div>
                )
            })}
            <button onClick={() => navigate('/home')}>Back to Home</button>

        </div>
    )
    

}

export default WeeklyTest;