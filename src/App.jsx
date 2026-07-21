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
import WeeklyTest from './pages/WeeklyTest';
import WeeklyTestExam from './pages/WeeklyTestExam';
import ProfileSetup from './pages/ProfileSetup';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import WaveSelect from './pages/WaveSelect';
import AuthCallback from './pages/AuthCallback';
import Layout from './components/Layout';



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
        <Route path="/auth/callback" element={<AuthCallback/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/subject" element={<ProtectedRoute><Layout><SubjectSelect/></Layout></ProtectedRoute>}/>
        <Route path="/practice" element={<ProtectedRoute><Practice/></ProtectedRoute>}/>
        <Route path="/chapters/:subject" element={<ProtectedRoute><Layout><ChapterSelect/></Layout></ProtectedRoute>}/>
        <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard/></Layout></ProtectedRoute>}/>   
        <Route path="/dashboard/:subject" element={<ProtectedRoute><Layout><SubjectDashboard/></Layout></ProtectedRoute>}/>
        <Route path="/weekly-test" element={<ProtectedRoute><Layout><WeeklyTest/></Layout></ProtectedRoute>} />
        <Route path='/weekly-test-exam' element={<ProtectedRoute><Layout><WeeklyTestExam/></Layout></ProtectedRoute>}/>
        <Route path="/profile-setup" element={<ProtectedRoute><Layout><ProfileSetup/></Layout></ProtectedRoute>}/>
        <Route path="/profile" element={<ProtectedRoute><Layout><Profile/></Layout></ProtectedRoute>}/>
        <Route path="/leaderboard" element={<ProtectedRoute><Layout><Leaderboard/></Layout></ProtectedRoute>}/>    
        <Route path="/wave/:subject" element={<ProtectedRoute><Layout><WaveSelect/></Layout></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App