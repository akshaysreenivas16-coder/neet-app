## App flow
Login -> home -> start paractice -> subjectSelect -> chapterSelect -> WaveSelect -> practice

1st login -> profile setup

home 
    - practice
    - dashboard
    - weekly test
    - profile
    - leaderboard

## Pages
- Signup.jsx
- Login.jsx
- Practice.jsx
- SubjectSelect.jsx
- chapterSelect.jsx
- Dashboard.jsx
- subjectDashboard.jsx
- home.jsx
- weeklytest.jsx
- ProfileSetup.jsx
- Profile.jsx
- LeaderBoard.jsx
- WaveSelect.jsx

## Component
- Questioncard.jsx

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

## gitignore
- .env (url & anon keys of supbase) 

## csv
- questions.csv (contains questions for each chapters)

