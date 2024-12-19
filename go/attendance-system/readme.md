curl -X POST http://localhost:3000/attendance -H "Content-Type: application/json" -d '{"lessonId": "MATH102", "date": "2024-12-19"}'

./attend_students.sh 676490bad5f0b5f2b2d382d6


curl -X POST http://localhost:3000/attendance -H "Content-Type: application/json" -d '{"lessonId": "BMG", "date": "2024-12-22"}'

 ./attend_students_delayed.sh 676495b07253b2ff2f78ab56