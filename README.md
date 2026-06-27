# NEET Prep App

A gamified NEET preparation platform built with React and Supabase.

## Features
- Practice questions by subject and chapter
- Progress tracking with accuracy detection
- Weak topic identification
- Daily streak counter
- Weekly competitive test with 80% accuracy gate
- Leaderboard with username display
- Profile setup and management

## Tech Stack
- React (Vite)
- Supabase (Database + Auth)
- React Router DOM
- Vercel (Hosting)

## How to Run
1. Clone the repo
2. Run `npm install`
3. Set up a Supabse project and add your credentials to `.env` file
4. Run `npm run dev`

## Pages
- Login / Signup
- Profile Setup (first time users)
- Home — central hub with streak display
- Subject Select
- Chapter Select
- Wave Select — questions split into 3 waves
- Practice — MCQ with explanation and progress tracking
- Dashboard — overall accuracy per subject
- Subject Dashboard — chapter wise weak topic detection
- Weekly Test — unlocks at 70% chapter accuracy
- Leaderboard — weekly rankings
- Profile — view your details