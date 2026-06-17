import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import { useState, useEffect } from 'react';
import supabase from './supabase';

import Practice from "./pages/Practice";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import SubjectSelect from './pages/SubjectSelect';
import ChapterSelect from './pages/ChapterSelect';
import Dashboard from './pages/Dashboard';
import SubjectDashboard from './pages/SubjectDashboard';
import Home from './pages/Home';


function ProtectedRoute({children}){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    async function checkUser() {
      const {data: {user}} = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    checkUser()
  },[])

  if(loading) return <p>Loading..</p>
  if(!user) return <Navigate to="/" />
  return children

 }

function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/home" element={<ProtectedRoute><Home/></ProtectedRoute>}/>
        <Route path="/subject" element={<ProtectedRoute><SubjectSelect/></ProtectedRoute>}/>
        <Route path="/practice" element={<ProtectedRoute><Practice/></ProtectedRoute>}/>
        <Route path="/chapters/:subject" element={<ProtectedRoute><ChapterSelect/></ProtectedRoute>}/> //colon is for variable selection of subjects
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>   
        <Route path="/dashboard/:subject" element={<ProtectedRoute><SubjectDashboard/></ProtectedRoute>}/> 
      </Routes>
    </BrowserRouter>
  )
}

export default App