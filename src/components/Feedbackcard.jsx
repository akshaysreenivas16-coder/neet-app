import { useState } from "react";

function FeedbackCard({answered, isCorrect, explanation, isLast, onContinue}){
    
    const [showExplanation, setShowExplanation] = useState(false)

    return( 
        <div className={`fixed bottom-0 left-0 right-0 p-4 rounded-t-2xl shadow-lg
            transistion-all duration-300 ease-out
            ${ answered ? 'translate-y-0' : 'translate-y-full'}
            ${ isCorrect ? 'bg-[#bee9e8]' : 'bg-[#ffcdd2]'}`}>

            <div className="max-w-md mx-auto">
                <p className={`font-bold text-lg mb-3 ${ isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {isCorrect ? "Correct!" : "Wrong!" }
                </p>

                <div className="mb-3">
                {!showExplanation 
                    ? <button onClick={()=>setShowExplanation(true)}
                        className={`w-full border-2 text-center py-3 rounded-xl font-semibold transition
                            ${ isCorrect ? 'border-green-400' : 'border-red-300' }
                            ${ isCorrect ? 'text-green-600' : 'text-red-400' }`
                        }>
                        See Explanation
                    </button>
                    : <p className="text-gray-600">{explanation}</p>
                }
                </div>

                <button onClick={()=>{
                    setShowExplanation(false)
                    onContinue()
                    }}
                    className={`w-full text-white text-center py-3 rounded-xl font-semibold transition
                        ${ isCorrect ? 'bg-green-600' : 'bg-red-700'}`}>
                        { isLast ? 'Finish' : 'Continue' }
                </button>
            </div>
        </div>
    )
}
export default FeedbackCard