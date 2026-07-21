## App flow
Login -> home -> start paractice -> subjectSelect -> chapterSelect -> WaveSelect -> practice

signup -> profile setup

home 
    - practice
    - dashboard
    - weekly test
    - profile
    - leaderboard
    - logout

## Pages
- Signup.jsx
- Login.jsx
- Practice.jsx
- SubjectSelect.jsx
- chapterSelect.jsx
- Dashboard.jsx
- SubjectDashboard.jsx
- Weeklytest.jsx
- WeeklyTestExam.jsx
- ProfileSetup.jsx
- Profile.jsx
- LeaderBoard.jsx
- WaveSelect.jsx
- AuthCallback.jsx

## Component
- Questioncard.jsx
- Navbar.jsx
- LAyout.jsx

## keyconcepts
- useEffect 
- useState
- useNavigate
- useParams
- useSearchParams
- supabase.auth
- foreign key to profile from weekly_test_results for fetching the username to the leaderboard (leaderboard.jsx)

## Intalled packages
- react-router-dom : page navigation
- @supabase/supabase-js : connect supabase
- tailwindcss : @tailwindcss/vite
- lucide-react : icons

## gitignore
- .env (url & anon keys of supbase) 

## csv
- files are stored in PC docs

## OAuth
- google cloud is used to make signup flawless 

## Database
- profile table is mapped to auth.users (foreign key)