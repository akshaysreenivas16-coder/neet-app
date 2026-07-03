import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabase";

function Leaderboard(){
    const navigate =  useNavigate()
    const [score, setScore] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        async function fetchLeaderboards() {
            const {data} = await supabase
                .from('weekly_test_results')
                .select('score,total,user_id,profiles(username)')
                .eq('week_number', 1)
                .order('score', {ascending:false})
            
            setScore(data || [])
            setLoading(false)
        }
        fetchLeaderboards()
    },[])

    return(
        <div>
            <h1>LeaderBoard -  Week 1</h1>
            {score.length === 0
            ?<p>No scores yet this Week</p>
            : score.map((entry, index)=>(
                <div key={entry.user_id} style={{
                        padding: '15px',
                        margin: '10px 0',
                        border: '1px solid #ccc',
                        borderRadius: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                    <p>#{index + 1} {entry.profiles?.username}</p>
                    <p>{entry.score}/{entry.total}</p>
                </div>
            ))}
            <button onClick={() => navigate('/home')}>Back to Home</button>
        </div>
    )
}
export default Leaderboard