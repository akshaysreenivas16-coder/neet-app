import { useNavigate } from "react-router-dom";
function SubjectSelect(){

    const navigate = useNavigate()
    const Subjects = [
        {name:'Biology', emoji:'🧬'},
        {name:'Chemistry',emoji:'⚗️'},
        {name:'Physics',emoji:'⚡'}
    ]

    return(
        <div className="min-h-screen bg-[#cae9ff] px-2 py-6">
            <div className="bg-white p-3 rounded-2xl max-w-md mx-auto">
                <h1 className="text-lg font-bold text-[#1b4965] text-center pb-5 max-w-md mx-auto">Start with a subject</h1>
                    <div className="space-y-1.5 max-w-md mx-auto">
                        {Subjects.map((subject)=>(
                            <button
                            key={subject.name}
                            onClick={()=> navigate(`/chapters/${subject.name}`)}
                            className="bg-white rounded-2xl p-5 w-full text-[#1b4965] font-bold text-lg ring-2 ring-[#5fa8d3]/30 shadow-lg hover:bg-[#bee9e8] transition flex items-center gap-4">
                                <span>{subject.emoji}</span>
                                <span>{subject.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
        </div>
    )
}

export default SubjectSelect;