import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Practice from "./pages/Practice";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/practice" element={<Practice/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App