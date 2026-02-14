@echo off
title AI Learning Assistant Starting.....

echo Starting Backend...
cd backend
start cmd /k uvicorn faiss_groq_app:app --reload

timeout /t 5

echo Starting Frontend...
cd ..
cd frontend
start cmd /k npm run dev
timeout /t 10

start http://localhost:8080

echo Project Started Successfully!
pause