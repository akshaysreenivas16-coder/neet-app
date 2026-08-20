import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import { useState, useEffect } from 'react';
import supabase from './supabase';

import Practice from "./pages/Practice";
import FeedbackCard from './components/Feedbackcard';
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
import PrivacyPolicy from "./pages/PrivacyPolicy"
import Terms from "./pages/Terms"
import { Atom } from 'react-loading-indicators';

function ProtectedRoute({children}){
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
      supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user || null)
        setLoading(false)
      })
    },[])

    if(loading) return <div className="min-h-screen bg-[#cae9ff] flex items-center justify-center"><Atom color="#1b4965" size="medium"/></div>
    if(!user) return <Navigate to="/" />
    return children
}

function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/privacy" element={<PrivacyPolicy/>}/>
        <Route path="/terms" element={<Terms/>}/>
        <Route path="/auth/callback" element={<AuthCallback/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/subject" element={<ProtectedRoute><Layout> <SubjectSelect/> </Layout></ProtectedRoute>}/>
        <Route path="/practice" element={<ProtectedRoute> <Practice/> </ProtectedRoute>}/>
        <Route path="/chapters/:subject" element={<ProtectedRoute><Layout> <ChapterSelect/> </Layout></ProtectedRoute>}/>
        <Route path="/dashboard" element={<ProtectedRoute><Layout> <Dashboard/> </Layout></ProtectedRoute>}/>   
        <Route path="/dashboard/:subject" element={<ProtectedRoute><Layout> <SubjectDashboard/> </Layout></ProtectedRoute>}/>
        <Route path="/weekly-test" element={<ProtectedRoute><Layout> <WeeklyTest/> </Layout></ProtectedRoute>} />
        <Route path='/weekly-test-exam' element={<ProtectedRoute> <WeeklyTestExam/> </ProtectedRoute>}/>
        <Route path="/profile-setup" element={<ProfileSetup/>}/>
        <Route path="/profile" element={<ProtectedRoute><Layout> <Profile/> </Layout></ProtectedRoute>}/>
        <Route path="/leaderboard" element={<ProtectedRoute><Layout> <Leaderboard/> </Layout></ProtectedRoute>}/>    
        <Route path="/wave/:subject" element={<ProtectedRoute><Layout> <WaveSelect/> </Layout></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App