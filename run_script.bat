::@echo off

:: Set title for the React frontend window and start it in the background
cd .\frontend\react-frontend\
start "React Frontend" npm run dev

:: Move back to the root project folder and then to the backend
cd ..\..\backend\

:: Set Flask app and run the Flask backend with a custom window title
start "Flask Backend" python -m pipenv run flask run --port=5000
