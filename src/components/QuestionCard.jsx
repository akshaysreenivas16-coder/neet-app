function QuestionCard({ question, onAnswer, selected, answered }) {
  return (
    <div>
      <p>
        {question.question.split('\n').map((line, i) => (
        <span key={i}>{line}<br/></span>
        ))}
      </p>
      {['A', 'B', 'C', 'D'].map((opt) => (
        <button
          key={opt}
          onClick={() => !answered && onAnswer(opt)}
          style={{
            display: 'block',
            margin: '5px',
            backgroundColor: answered
              ? opt === question.correct_option
                ? 'green'
                : opt === selected
                ? 'red'
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