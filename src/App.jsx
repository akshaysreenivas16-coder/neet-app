import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Practice from "./pages/Practice";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import SubjectSelect from './pages/SubjectSelect';
import ChapterSelect from './pages/ChapterSelect';

function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/subject" element={<SubjectSelect/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/practice" element={<Practice/>}/>
        <Route path="/chapters/:subject" element={<ChapterSelect/>}/> //colon is for variable selection of subjects
      </Routes>
    </BrowserRouter>
  )
}

export default App