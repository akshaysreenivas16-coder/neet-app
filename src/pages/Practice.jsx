import { useEffect, useState } from "react";
import { X } from "lucide-react";
import supabase from "../supabase";
import QuestionCard from '../components/QuestionCard'
import FeedbackCard from "../components/Feedbackcard";
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
    const [streak, setStreak] = useState(0)
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
                .order('id' , { ascending : true})
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
    
    //continue 
    function handleContinue(){
        setCurrentIndex( currentIndex + 1 )
        setSelected(null)
        setAnswered(false)
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
        setStreak(1)
    }else if(data.last_practiced === today){
        setStreak(data.current_streak)
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

        setStreak(newStreak)
    }

}

    //final score screen
   if(!loading && currentIndex >= questions.length){
    return(
        
        <div className="min-h-screen bg-[#cae9ff] px-4 py-6 flex flex-col justify-between">
        
            {/* Top section */}
            <div className="flex flex-col items-center gap-4 mt-8">
 
                <h2 className="text-center text-2xl font-bold text-[#1b4965] mb-1">Wave Complete!</h2>
                <p className="text-gray-500 text-sm">{chapter}</p>  

                {/* Score Board */}
                <div className="bg-white shadow-md w-100 h-40 flex flex-col items-center justify-center">
                    <p className="text-4xl font-bold text-[#1b4965]">{score}/{questions.length}</p>
                    <p className="text-sm text-gray-400">score</p>
                </div>
                    
                {/* Message */}
                <div className="bg-white w-full rounded-2xl px-6 py-3 shadow-sm text-center">
                    { score === questions.length 
                    ? <p className="text-center text-[#fb8b24] font-semibold">Perfect score! 🌟</p>
                    : score >= questions.length / 2
                    ? <p className="text-center text-green-600 font-semibold">Good job! Keep practicing 💪</p>
                    : <p className="text-center text-red-500 font-semibold">You'll get better! 📚</p>
                    }
                </div>

                {/* streak */}
                <div className="bg-white rounded-2xl px-6 py-4 w-full flex items-center gap-3">
                    <span className="text-3xl">🔥</span>
                    <div>
                        <p className="font-bold text-orange-500 text-lg">{streak}</p>
                        <p className="text-sm text-gray-400">Keep it going!</p>
                    </div>
                </div>

            </div>

            {/* Bottom buttons */}
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
                    onClick={() => navigate(`/wave/${subject}?chapter=${chapter}`)} 
                    className="mt-2 w-full bg-[#1b4965] text-white py-3 rounded-xl font-semibold hover:bg-[#0d1b2a] transition">
                        Back to waves
                </button>
            </div>
        </div>
        )
    }
    return(

        <div className="bg-white min-h-screen">
            <div className="p-4 max-w-md mx-auto min-h-[calc(100vh-2rem)] flex flex-col">
               
                {/* Top - progress */}
                <div>
                    <h1 className="flex justify-between">
                        <span className="text-[#1b4965] font-bold">
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
                        <QuestionCard 
                            question={questions[currentIndex]}
                            onAnswer={checkAnswer}
                            selected={selected}
                            answered={answered}
                        />
                    )}
                </div>

                {/* FeedBack component */}
                {questions.length > 0 && (
                    <FeedbackCard
                        answered = {answered}
                        isCorrect = {selected === questions[currentIndex]?.correct_option}
                        explanation = {questions[currentIndex]?.explanation}
                        isLast = {currentIndex + 1 >= questions.length}
                        onContinue = {handleContinue} 
                    />
                )}

            </div> 
            
        </div>
    )
}

export default Practice