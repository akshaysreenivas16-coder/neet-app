import { useState, useEffect } from "react";
import { useNavigate, useSearchParams} from  "react-router-dom";
import { X } from "lucide-react";
import { Atom } from 'react-loading-indicators'
import supabase from "../supabase";
import QuestionCard from "../components/QuestionCard"
import FeedbackCard from "../components/Feedbackcard";



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

    function handleContinue(){
        if(currentIndex + 1 >= questions.length){
            handleFinish( score + (selected === questions[currentIndex].correct_option? 1:0))
            setFinished(true)
        }else{
            setCurrentIndex(currentIndex + 1)
            setSelected(null)
            setAnswered(false)
        }
    }

    if (loading) return (
            <div className="bg-[#cae9ff] min-h-screen mx-auto flex items-center justify-center">
                <Atom color="#1b4965" size="medium"/>
            </div>
        )  

    if (finished) return(
    
        <div className="min-h-screen bg-[#cae9ff] px-4 py-6 flex flex-col justify-between">
        
            {/* Top section */}
            <div className="flex flex-col items-center gap-4 mt-8">
 
                <h2 className="text-center text-2xl font-bold text-[#1b4965] mb-1">Wave Complete!</h2>
                <p className="text-gray-500 text-sm">week {weekNumber}</p>  

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

            </div>

            {/* Bottom button */}
            <div>
                <button 
                    onClick={() => navigate('/weekly-test')} 
                    className="mt-2 w-full bg-[#1b4965] text-white py-3 rounded-xl font-semibold hover:bg-[#0d1b2a] transition">
                        Back to weekly tests
                </button>
            </div>
        </div>
    
    )

    return(
        <div className="bg-white min-h-screen px-2 py-2">
            <div className="p-4 max-w-md mx-auto rounded-2xl min-h-[calc(100vh-2rem)] flex flex-col">
                {/* Top progress */}
                <div>
                    <h1 className="flex justify-between">
                        <span className="text-[#1b4965] font-bold">Weekly Test - {weekNumber}</span>
                        <button onClick={()=>navigate('/weekly-test')}>< X/></button>                    
                    </h1>
                    <div className="bg-gray-200 h-2.5 my-2 rounded-full w-full">
                        <div className={`bg-green-500 h-2.5 my-2 rounded-full transition-all duration-300`}
                           style={{
                            width: `${((currentIndex+1)/questions.length) *100}%`
                           }}>
                        </div>
                    </div>
                    <p className="text-gray-500 mb-3">{currentIndex + 1}/{questions.length} Questions</p>
                </div>

                {/* Middle question + options */}
                <div className="flex-1">
                    <QuestionCard
                        question = {questions[currentIndex]}
                        selected = {selected}
                        answered = {answered}
                        onAnswer = {checkAnswer}
                    />
                </div>

                <div>
                   {questions.length > 0 && (
                    <FeedbackCard
                    answered={answered}
                    isCorrect={selected === questions[currentIndex]?.correct_option}
                    explanation={questions[currentIndex]?.explanation}
                    isLast={currentIndex+1 >= questions.length}
                    onContinue={handleContinue}
                    />
                   )}
                </div> 
            </div>
        </div>
    )

}

export default WeeklyTestExam
