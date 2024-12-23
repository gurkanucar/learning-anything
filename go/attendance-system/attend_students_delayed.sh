#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: $0 <lesson_id>"
    exit 1
fi

LESSON_ID=$1

# Generate student IDs (ST0001 to ST0100) using a loop
STUDENT_IDS=()
for i in $(seq 1 100); do
    STUDENT_IDS+=("ST$(printf "%04d" $i)")
done

# Calculate 70% of the total number of students
TOTAL_STUDENTS=${#STUDENT_IDS[@]}
SELECT_COUNT=$((TOTAL_STUDENTS * 70 / 100))

# Shuffle and pick 70% of students randomly
SELECTED_STUDENTS=($(printf "%s\n" "${STUDENT_IDS[@]}" | shuf | head -n $SELECT_COUNT))

# Function to mark attendance
mark_attendance() {
    STUDENT_ID=$1
    curl -s -X PUT "http://localhost:3000/attendance/$LESSON_ID/mark" \
        -H "Content-Type: application/json" \
        -d "{\"studentId\": \"$STUDENT_ID\", \"present\": true}" \
        > /dev/null && echo "Marked attendance for $STUDENT_ID"
}

# Calculate base delay and randomize delay
BASE_DELAY=$((10 / SELECT_COUNT))  # Base delay in seconds
if [ $BASE_DELAY -le 0 ]; then
    BASE_DELAY=1  # Minimum delay of 1 second
fi

echo "Marking attendance for $SELECT_COUNT students (70%) in lesson $LESSON_ID..."
for STUDENT_ID in "${SELECTED_STUDENTS[@]}"; do
    mark_attendance "$STUDENT_ID" &
    RANDOM_DELAY=$(awk -v base=$BASE_DELAY 'BEGIN { srand(); print base + rand() * 0.5 }') # Randomize delay
    sleep $RANDOM_DELAY
done
wait
echo "Attendance marking complete!"
