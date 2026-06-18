import { useEffect, useState } from "react";
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

    //question fetching from database
    useEffect(() => {
        async function fetchQuestions(){
            const { data } = await supabase
                .from('questions')
                .select('*')
                .eq('subject', subject.toLowerCase())
                .eq('chapter', chapter)
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
        <div>
            <h1>Quiz Completed! 🎉</h1>
            <h2>You got {score} out of {questions.length} correct</h2>
            {score === questions.length 
                ? <p>Perfect score! 🌟</p>
                : score >= questions.length / 2
                ? <p>Good job! Keep practicing 💪</p>
                : <p>Keep going, you'll get better! 📚</p>
            }
            <button onClick={() => {
                setCurrentIndex(0)
                setScore(0)
                setSelected(null)
                setAnswered(false)
            }}>
                Try Again</button>
              <button onClick={() => navigate('/home')}>Back to Home</button>
        </div>
        )
    }
    return(

        <div>
            <h1>NEET Practice</h1>
                <div style={{
                    width: '100%',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '10px',
                    height: '10px',
                    margin: '10px 0'
                }}>
                 <div style={{
                    width: `${((currentIndex) / questions.length) * 100}%`,
                    backgroundColor: '#4caf50',
                    borderRadius: '10px',
                    height: '10px',
                    transition: 'width 0.3s ease'
                }}>
                 </div>
                </div>
            <p>{currentIndex}/{questions.length} Questions</p>
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
                        ? <p style={{color:"green"}}>Correct!</p>
                        : <p style={{color:"red"}}>Wrong!</p>
                        }
                        <p>{questions[currentIndex].explanation}</p>
                    </div>
                )}

                {answered && (
                    <button onClick={()=>{
                        setCurrentIndex(currentIndex+1)
                        setSelected(null)
                        setAnswered(false)
                    }}>Next</button>
                )}
                </>
            )}
        </div>
    )
}

export default Practice