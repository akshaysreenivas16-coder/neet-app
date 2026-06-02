import { useEffect, useState } from "react";
import supabase from "../supabase";
import QuestionCard from '../components/QuestionCard'
import { Navigate, useNavigate} from "react-router-dom";

function Practice(){
    const [questions, setQuestions] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selected, setSelected]= useState(null)
    const [answered, setAnswered]= useState(false)
    const [score, setScore]= useState(0)
    const [loading, setloading]=useState(true)
    const [user, setUser]=useState(null)
    const navigate=useNavigate()


    //logout
    async function handleLogout(){
        await supabase.auth.signOut()
        navigate("/")
    }

    //authorizing for only signuped users
    useEffect(()=>{ 
        async function checkUser() {
            const {data} = await supabase.auth.getSession()
            if(!data.session){
                navigate("/")
            }else{
                setUser(data.session.user)
            }
        }
        checkUser()
    },[])

    //question fecting fromdatabase
    useEffect(() => {
        async function fetchQuestions(){
            const { data } = await supabase
                .from('questions')
                .select('*')
            setQuestions(data)
            setloading(false)
        }
        fetchQuestions()
    }, [])

    //answer checking and scoring
    function checkAnswer(option) {
        setSelected(option)
        setAnswered(true)
        if(option === questions[currentIndex].correct_option){
        setScore(prev => prev + 1)
        }
    }


    //last page showing final score
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
                Try Again
            </button>
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

                <button onClick={handleLogout}>Logout</button>
               
                </>
            )}
        </div>
    )
}

export default Practice