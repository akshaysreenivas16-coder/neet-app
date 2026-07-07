import { useState, useEffect } from "react";
import { useNavigate, useSearchParams} from  "react-router-dom";
import supabase from "../supabase";
import QuestionCard from "../components/QuestionCard"



function WeeklyTestExam(){

    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const weekNumber = parseInt(searchParams.get('week'))

    const [questions, setQuestions] = useState([])
    const [selected, setSelected] = useState(null)
    const [answered, setAnswered] = useState(false)
    const [score, setScore] = useState(0)
    const [finished, setFinished] = useState(false)
    const [loading, setLoading] = useState(true)
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(()=>{
        async function fetchQuestion() {
            const {data} = await supabase
                .from('weekly_test_questions')
                .select('*')
                .eq('week_number', weekNumber)
            setQuestions(data)
            setLoading(false)
        }
        fetchQuestion()
    },[weekNumber])

    async function handleFinish(finalscore){
        const {data : {user}} = await supabase.auth.getUser()
        if(!user) return

        const {data} = await supabase.from('weekly_test_results').insert({
            user_id : user.id,
            week_number : weekNumber,
            score : finalscore,
            total : questions.length
        })
    }

    function checkAnswer(option){
        setSelected(option)
        setAnswered(true)
        if(option === questions[currentIndex].correct_option) {
            setScore(prev => prev + 1)
        }   
    }

    function handleNext(){
        if(currentIndex + 1 >= questions.length){
            handleFinish( score + (selected === questions[currentIndex].correct_option? 1:0))
            setFinished(true)
        }else{
            setCurrentIndex(currentIndex + 1)
            setSelected(null)
            setAnswered(false)
        }
    }

    if (loading) return <p>Loading...</p>

    if (finished) return(
        <div>
            <h1>Weekly Test completed</h1>
            <h3>score : {score}/{questions.length}</h3>
            <button onClick={()=>navigate('/weekly-test')}>Back to tests</button>
        </div>

    )

    return(
        <div>
            <h1>Weekly Test - {weekNumber}</h1>
            <p>{currentIndex + 1}/{questions.length} Questions</p>
            <QuestionCard
                question = {questions[currentIndex]}
                selected = {selected}
                answered = {answered}
                onAnswer = {checkAnswer}
            />
            {answered && (
                <div>
                {selected === questions[currentIndex].correct_option 
                ? <p style={{color : 'green'}}>Correct!</p>
                : <p style={{color : 'red'}}>wrong!</p>
                }

                <p>{questions[currentIndex].explanation}</p>
                <button onClick={handleNext}>
                    {currentIndex + 1 >= questions.length ? 'finish' : 'next'}
                </button>
                </div>
            )}

        </div>
    )

}

export default WeeklyTestExam
