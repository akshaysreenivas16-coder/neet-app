import { Navigate, useNavigate } from "react-router-dom";
function SubjectSelect(){

    const navigate = useNavigate()
    const Subjects = ['Biology' ,'Chemistry' ,'Physics']

    return(
        <div>
            <h1>SELECT SUBJECT</h1>
            {Subjects.map((subject)=>(
                <button
                key={subject}
                onClick={()=> navigate(`/chapters/${subject}`)}>
                    {subject}
                </button>
            ))}
        </div>
    )
}

export default SubjectSelect;