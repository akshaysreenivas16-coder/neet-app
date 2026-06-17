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
               <button onClick={()=>navigate('/home')} style={{marginTop:'20px', display:"block"}}>back to home</button>
        </div>
    )
}

export default SubjectSelect;