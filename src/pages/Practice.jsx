import { useEffect, useState } from "react";
import { X } from "lucide-react";
import supabase from "../supabase";
import QuestionCard from '../components/QuestionCard'
import { useNavigate, useSearchParams} from "react-router-dom";

function Practice(){
    const navigate=useNavigate()
    const [searchParams]= useSearchParams() // to read the values from url 
    const subject = searchParams.get('subject')
    const chapter = searchParams.get('chapter')

    const [questions, setQuestions] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selected, setSelected]= useState(null)
    const [answered, setAnswered]= useState(false)
    const [score, setScore]= useState(0)
    const [loading, setloading]=useState(true)
    const from = parseInt(searchParams.get('from')) || 0
    const to = parseInt(searchParams.get('to')) || 10

    //question fetching from database
    useEffect(() => {
        async function fetchQuestions(){
            const { data } = await supabase
                .from('questions')
                .select('*')
                .eq('subject', subject.toLowerCase())
                .eq('chapter', chapter)
                .range(from, to -1)
            setQuestions(data)
            setloading(false)
        }
        fetchQuestions()
    }, [subject, chapter])

    //answer checking and scoring
    function checkAnswer(option) {
        setSelected(option)
        setAnswered(true)
        const isCorrect = option === questions[currentIndex].correct_option
        if (isCorrect){
        setScore(prev => prev + 1)
        }
        saveProgress(isCorrect)
        updateStreak()
    }

    //saving progress
    async function saveProgress(isCorrect){
    const { data:{user} } = await supabase.auth.getUser()
    if(!user) return

    const { data } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('subject', subject)
        .eq('chapter', chapter)
        .single()

    if (data) {
        const newAttempted = data.attempted + 1
        const newCorrect = data.correct + (isCorrect ? 1 : 0)
        const newAccuracy = (newCorrect / newAttempted) * 100

        await supabase
            .from('user_progress')
            .update({
                attempted: newAttempted,
                correct: newCorrect,
                accuracy: newAccuracy,
                last_attempted: new Date()
            })
            .eq('user_id', user.id)
            .eq('subject', subject)
            .eq('chapter', chapter)
    } else {
        await supabase
            .from('user_progress')
            .insert({
                user_id: user.id,
                subject: subject,
                chapter: chapter,
                attempted: 1,
                correct: isCorrect ? 1 : 0,
                accuracy: isCorrect ? 100 : 0
            })
    }
}

//streak
async function updateStreak() {
    const {data:{user}} = await supabase.auth.getUser()
    if(!user) return

    const today = new Date().toISOString().split('T')[0]

    const {data} = await supabase 
        .from('user_streaks')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if(!data){
        await supabase.from('user_streaks').insert({
            user_id : user.id,
            current_streak : 1,
            last_practiced : today
        })
    }else if(data.last_practiced === today){
        return
    }else{
        const yestarday = new Date()
        yestarday.setDate(yestarday.getDate() -1)
        const yestardayStr = yestarday.toISOString().split('T')[0]

        const newStreak = data.last_practiced === yestardayStr
            ? data.current_streak + 1
            :1

        await supabase.from('user_streaks').update({
            current_streak: newStreak,
            last_practiced: today
        }).eq('user_id', user.id)

    }

}

    //final score screen
   if(!loading && currentIndex >= questions.length){
    return(
        
        <div className="min-h-screen bg-[#bee9e8] px-2 py-1 flex items-center">
            <div className="bg-white px-2 py-2 rounded-2xl max-w-md w-full mx-auto shadow-lg min-h-[calc(100vh-2rem)] flex flex-col justify-between">
                <div className="flex flex-col items-center justify-center flex-1 ">
                <h2 className="text-center text-2xl font-bold text-[#1b4965] mb-1">Practice Completed!</h2>
                <p className="text-center text-gray-500 mb-4">You got {score} out of {questions.length} correct</p>
                {score === questions.length 
                    ? <p className="text-center text-[#fb8b24] font-semibold">Perfect score! 🌟</p>
                    : score >= questions.length / 2
                    ? <p className="text-center text-green-600 font-semibold">Good job! Keep practicing 💪</p>
                    : <p className="text-center text-red-500 font-semibold">Keep going, you'll get better! 📚</p>
                }
                </div>
                <div>
                    <button onClick={() => {
                        setCurrentIndex(0)
                        setScore(0)
                        setSelected(null)
                        setAnswered(false)
                    }}className="mt-6 w-full bg-[#1b4965]/80 text-white py-3 rounded-xl font-semibold hover:bg-[#0d1b2a] transition ">
                        Try Again
                    </button>
                    <button 
                        onClick={() => navigate(`/wave/${subject}?chapter=${chapter}`)} className="mt-2 w-full bg-[#1b4965] text-white py-3 rounded-xl font-semibold hover:bg-[#0d1b2a] transition">
                        Back to waves
                    </button>
                </div>
            </div>
        </div>
        )
    }
    return(

        <div className="bg-[#bee9e8] min-h-screen px-2 py-2">
            <div className="bg-white p-4 rounded-2xl max-w-md mx-auto min-h-[calc(100vh-2rem)] flex flex-col">
               
                {/* Top - progress */}
                <div>
                    <h1 className="flex justify-between">
                        <span>
                            NEET Practice
                        </span>
                        <button onClick={()=>navigate(`/wave/${subject}?chapter=${chapter}`)}>
                            <X />
                        </button>
                    </h1>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 my-2">
                        <div className="bg-green-500 h-2.5 rounded-full transition-all duration-300" 
                            style={{
                            width: `${((currentIndex+1) / questions.length) * 100}%`}}>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{currentIndex+1}/{questions.length} Questions</p>
                </div>

                {/* Middle - question + options */}
                <div className="flex-1">
                    {questions.length > 0 && (
                        <>
                        <QuestionCard 
                            question={questions[currentIndex]}
                            onAnswer={checkAnswer}
                            selected={selected}
                            answered={answered}
                        />
                        {answered && (
                            <div>
                                {selected === questions[currentIndex].correct_option 
                                ? <p className="text-green-600 font-semibold mt-2">Correct!</p>
                                : <p className="text-red-600 font-semibold mt-2">Wrong!</p>
                                }
                                <p className="text-gray-600 text-sm mt-2 p-3 rounded-lg">
                                    {questions[currentIndex].explanation}
                                </p>
                            </div>
                        )}
                        </>
                    )}
                </div>

                {/* Bottom - next button*/}
                {answered && (
                    <button onClick={()=>{
                        setCurrentIndex(currentIndex+1)
                        setSelected(null)
                        setAnswered(false)
                    }}
                    className="mt-4 w-full bg-[#1b4965] text-white py-3 rounded-xl font-semibold hover:bg-[#0d1b2a] transition">
                        Next
                    </button>
                )}
            </div> 
            
        </div>
    )
}

export default Practice