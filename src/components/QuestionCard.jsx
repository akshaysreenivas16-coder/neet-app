function QuestionCard({ question, onAnswer, selected, answered }) {
  return (
    <div>
      <p className="pb-5">
        {question.question.split('\n').map((line, i) => (
        <span key={i}>{line}<br/></span>
        ))}
      </p>
      {['A', 'B', 'C', 'D'].map((opt) => (
        <button
          key={opt}
          onClick={() => !answered && onAnswer(opt)}
          className="w-full items text-base text-left border-2 border-[#5fa8d3]/30 p-2 rounded-2xl p-3 mb-2"
          style={{
            backgroundColor: answered
              ? opt === question.correct_option
                ? '#bee9e8'
                : opt === selected
                ? '#ffcdd2'
                : 'white'
              : 'white'
          }}
        >
          {opt}. {question[`option_${opt.toLowerCase()}`]}
        </button>
      ))}
    </div>
  )
}

export default QuestionCard