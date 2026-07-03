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
import WeeklyTest from './pages/WeeklyTest';
import ProfileSetup from './pages/ProfileSetup';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import WaveSelect from './pages/WaveSelect';
import AuthCallback from './pages/AuthCallback';


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
        <Route path="/home" element={<ProtectedRoute><Home/></ProtectedRoute>}/>
        <Route path="/subject" element={<ProtectedRoute><SubjectSelect/></ProtectedRoute>}/>
        <Route path="/practice" element={<ProtectedRoute><Practice/></ProtectedRoute>}/>
        <Route path="/chapters/:subject" element={<ProtectedRoute><ChapterSelect/></ProtectedRoute>}/>
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>   
        <Route path="/dashboard/:subject" element={<ProtectedRoute><SubjectDashboard/></ProtectedRoute>}/>
        <Route path="/weekly-test" element={<ProtectedRoute><WeeklyTest/></ProtectedRoute>} />
        <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup/></ProtectedRoute>}/>
        <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard/></ProtectedRoute>}/>    
        <Route path="/wave/:subject" element={<ProtectedRoute><WaveSelect/></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App