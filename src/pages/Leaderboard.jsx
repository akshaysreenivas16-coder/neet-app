import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Atom } from 'react-loading-indicators'
import supabase from "../supabase";

function Leaderboard(){
    const navigate =  useNavigate()
    const [scores, setScores] = useState([])
    const [userRank, setUserRank] = useState(null)
    const [loading, setLoading] = useState(true)
    const [currentWeek, setCurrentWeek] = useState(null)

    useEffect(()=>{
        async function fetchLeaderboards() {
            const {data: {user}} =  await supabase.auth.getUser()
            if (!user) return

            // fetch the current week
            const today = new Date().toISOString().split('T')[0]
            const {data : weekData} = await supabase
                .from('weekly_tests')
                .select('*')
                .lte('start_date', today)
                .gte('end_date', today)
                .single()

            if(!weekData){
                setLoading(false)
                return
            }

            setCurrentWeek(weekData.week_number)

            // fetch all scores
            const {data} = await supabase
                .from('weekly_test_results')
                .select('score,total,user_id,profiles(username)')
                .eq('week_number', weekData.week_number)
                .order('score', {ascending:false})

                if(!data){
                    setLoading(false)
                    return
                }

            // top 10 
            const top10 =  data.slice(0,10)
            setScores(top10)

            // find current user rank
            const userIndex = data.findIndex(entry => entry.user_id === user.id)
            if (userIndex !== -1) {
                setUserRank({
                    rank: userIndex +1,
                    ...data[userIndex]
                })
            }
            setLoading(false)
        }
        fetchLeaderboards()
    },[])

    if(loading) return (
        <div className="bg-[#cae9ff] min-h-screen mx-auto flex items-center justify-center">
            <Atom color="#1b4965" size="medium"/>
        </div>
    )

    return(
        <div className="bg-[#cae9ff] min-h-screen px-2 py-6">
            <div className="bg-white p-3 rounded-2xl max-w-md mx-auto">
                <h1 className="mb-4 text-center">LeaderBoard -  Week {currentWeek || '-'}</h1>
                {scores.length === 0
                ?<p className="text-center">No scores yet this Week</p>
                : scores.map((entry, index)=>(
                    <div key={entry.user_id}
                        className={`flex items-center justify-between p-4 rounded-2xl ${
                        index === 0 ? 'bg-[#fb8b24]/10 border-2 border-[#fb8b24]'
                        : index === 1 ? 'bg-gray-100 border border-gray-300'
                        : index === 2 ? 'bg-orange-50 border border-orange-200'
                        : 'border border-gray-200'
                        }`}>
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-[#1b4965] w-6">
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                            </span>
                            <span className="font-semibold text-[#1b4965]">
                                {entry.profiles?.username}
                            </span>
                        </div>
                        <span className="font-bold text-[#1b4965]">
                            {entry.score}/{entry.total}
                        </span>
                    </div>
                ))}
            
                {/* Divider + user Rank */}
                {userRank && userRank.rank > 10 && (
                    <>
                    <div className="flex items-center gap-2 my-3">
                        <div className="flex-1 border-t border-dashed border-gray-300"/>
                        <span>your rank</span>
                        <div className="flex-1 border-t border-dashed border-gray-300"/>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-[#bee9e8] border-2 border-[#62b6cb]">
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-[#1b4965]">#{userRank.rank}</span>
                            <span className="font-semibold text-[#1b4965]">{userRank.profiles?.username}</span>
                        </div>
                        <span className="font-bold text-[#1b4965]">{userRank.score}/{userRank.total}</span>
                    </div>
                    </>
                )}
            </div>
        </div>
    )
}
export default Leaderboard