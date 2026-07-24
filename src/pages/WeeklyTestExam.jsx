import { useState, useEffect } from "react";
import { useNavigate, useSearchParams} from  "react-router-dom";
import { X } from "lucide-react";
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
        <div className="bg-[#cae9ff] min-h-screen px-2 py-2">
            <div className="bg-white p-4 max-w-md mx-auto rounded-2xl min-h-screen flex flex-col justify-between">
                {/* Centered content */}
                <div className="flex flex-col items-center justify-center flex-1 gap-2">
                    <h1 className="text-xl text-[#1b4965] font-bold">Weekly Test complete!</h1>
                    <div className="text-center bg-[#cae9ff] px-8 py-4 rounded-2xl">
                        <p className="text-sm">your score</p>
                        <p className="text-4xl font-bold text-[#1b4965]">{score}/{questions.length}</p>
                    </div>
                    {score >= questions.length * 0.8 
                        ? <p className="text-green-600 font-semibold">Excellent !!</p>
                        : score >= questions.length * 0.5 
                        ? <p className="text-[#fb8b24] font-semibold">Good efforts</p>
                        : <p className="text-red-600 font-semibold">Keep practicing..</p> 
                    }
                </div>

                {/* Button at bottom */}
                <div>
                    <button 
                        className="w-full bg-[#1b4965] text-white py-3 rounded-xl"
                        onClick={()=>navigate('/weekly-test')}>
                            Back to Tests
                    </button>
                </div>
            </div>
        </div>
    )

    return(
        <div className="bg-[#cae9ff] min-h-screen px-2 py-2">
            <div className="bg-white p-4 max-w-md mx-auto rounded-2xl min-h-[calc(100vh-2rem)] flex flex-col">
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
                
                    {answered && (
                        <div>
                            {selected === questions[currentIndex].correct_option 
                            ? <p className="text-green-600 font-semibold px-3">Correct!</p>
                            : <p className="text-red-600 font-semibold px-3 ">wrong!</p>
                            }
                            <p className="text-gray-600 text-sm p-3">
                                {questions[currentIndex].explanation}
                            </p>
                        </div>
                    )}
                </div>

                <div>
                    {answered && (
                        <button 
                            onClick={handleNext}
                            className="w-full bg-[#1b4965] text-white py-3 rounded-xl">
                                {currentIndex + 1 >= questions.length ? 'finish' : 'next'}
                        </button>
                    )}   
                </div> 
            </div>
        </div>
    )

}

export default WeeklyTestExam
