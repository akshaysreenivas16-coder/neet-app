import { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom"
import supabase from "../supabase"
import QuestionCard from "../components/QuestionCard"

function WeeklyTest(){
    const navigate = useNavigate()
    const [weekData, setWeekData] = useState(null)
    const [alreadyTaken, setAlreadyTaken] = useState(false)
    const [loading, setLoading] = useState(true)
    const [blockReason, setBlockReason] = useState("")
    const [questions, setQuestions] = useState([])
    const [allowed, setAllowed] = useState(false)
    const [score, setScore] = useState(0)
    const [selected, setSelected] = useState(null)
    const [answered, setAnswered] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [finished, setFinished] = useState(false)

    useEffect(()=>{
        async function checkAcces() {
            const {data : {user}} = await supabase.auth.getUser()
            if(!user) return

            //getting current week
            const {data: week} = await supabase
                .from("weekly_tests")
                .select('*')
                .eq('week_number',1)//for first week change it before release
                .single()
            setWeekData(week)

            //check if already taken
            const {data: results} = await supabase
                .from('weekly_test_results')
                .select('*')
                .eq('user_id', user.id)
                .eq('week_number', 1)
                .maybeSingle()

            if(results){
                setAlreadyTaken(true)
                setLoading(false)
                return
            }

            //check accuracy for each chapter
            const {data: progress} =  await supabase
                .from('user_progress')
                .select('*')
                .eq('user_id', user.id)
                .eq('subject', week.subject)
                .in('chapter', week.chapters)
            
            const notReady = week.chapters.filter(chapter => {
                const row = progress?.find(p => p.chapter === chapter)
                return !row || row.accuracy < 70
            })
            
            if(notReady.length > 0){
                setBlockReason(`you need 70%+ accuracy  in : ${notReady.join(',')}`)
                setLoading(false)
                return
            }

            //fetch questions
            const {data: qs}= await supabase
                .from('weekly_test_questions')
                .select('*')
                .eq('week_number', 1)
                
            setQuestions(qs)
            setAllowed(true)
            setLoading(false)
        }
        checkAcces()
    },[])

    async function handleFinish(finalScore) {
        const {data: {user}} = await supabase.auth.getUser()
        if(!user) return

        await supabase.from('weekly_test_results').insert({
            user_id: user.id,
            week_number: 1,
            score: finalScore,
            total: questions.length
        })   
    }

    function checkAnswer(option){
        setSelected(option)
        setAnswered(true)
        if(option === questions[currentIndex].correct_option){
            setScore(prev => prev + 1)
        }
    }

    function handleNext(){
        if (currentIndex + 1 >= questions.length){
            handleFinish( score + (selected === questions[currentIndex].correct_option? 1 : 0))
            setFinished(true)
        }else{
            setCurrentIndex(currentIndex + 1)
            setSelected(null)
            setAnswered(false)
        }
    }

    if(loading) return <p>Loading..</p>

    if(alreadyTaken) return(
        <div>
            <h1>Weekly Test</h1>
            <p>You have already taken this week's test.</p>
            <button onClick={() => navigate('/home')}>Back to Home</button>
        </div>
    )

    if(!allowed) return(
        <div>
            <h1>weekly Test Locked 🔒</h1>
            <p>{blockReason}</p>
            <button onClick={() => navigate('/home')}>Back to Home</button>
        </div>
    )

    if (finished) return (
        <div>
            <h1>Weekly Test completed</h1>
            <h2>Score : {score}/{questions.length}</h2>
            <button onClick={() => navigate('/home')}>Back to Home</button>
        </div>
    )

 return(
    <div>
        <h1>Weekly Test - Week 1</h1>
        <p>{currentIndex +1}/{questions.length} Questions</p>
        <QuestionCard
            question={questions[currentIndex]}
            onAnswer={checkAnswer}
            selected={selected}
            answered={answered}
            />
        {answered && (
            <div>
                {selected === questions[currentIndex].correct_option
                ? <p style={{color: 'green'}}>Correct!</p>
                : <p style={{color: 'red'}}>wrong!!</p>
                }
                <p>{questions[currentIndex].explanation}</p>
                <button onClick={handleNext}>
                    {currentIndex + 1 >= questions.length? 'finish' : 'next'}
                </button>
            </div>
        )}
    </div>
 )   
}

export default WeeklyTest