import { Circle } from "lucide-react"

function CircleProgress({accuracy}){
    const radius = 33
    const circumference = 2 * Math.PI * radius
    const progress = (accuracy / 100)* circumference

    return(
        <svg width="80" height="80">
            {/* background circle*/}
            <circle
                cx="40"
                cy="40"
                r={radius}
                fill="none"
                stroke="#e0e0e0"
                strokeWidth="8"
            />
            {/* progress circle*/}
            <circle
                cx="40"
                cy="40"
                r={radius}
                fill="none"
                stroke={accuracy >= 70 ? '#62b6cb' : accuracy>=50 ? '#fb8b24' : '#ef4444'}
                strokeDasharray={circumference}
                strokeDashoffset={circumference - progress}
                strokeWidth="8"
                strokeLinecap="round"
                transform="rotate(-90 40 40)"
            />
            {/* text in center*/}
            <text x="40" y="45" textAnchor="middle" fill="#1b4965" className="font-bold text-sm">
                {Math.round(accuracy)}%
            </text>
        </svg>
    )
}

export default CircleProgress