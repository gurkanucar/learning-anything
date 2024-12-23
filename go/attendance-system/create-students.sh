#!/bin/bash

# Array of first names and last names for variety
first_names=("John" "Jane" "Michael" "Sarah" "David" "Emma" "James" "Emily" "William" "Olivia")
last_names=("Smith" "Johnson" "Williams" "Brown" "Jones" "Garcia" "Miller" "Davis" "Rodriguez" "Martinez")

# Loop to create 100 students
for i in {1..100}
do
    # Get random first and last name
    first_name=${first_names[$RANDOM % ${#first_names[@]}]}
    last_name=${last_names[$RANDOM % ${#last_names[@]}]}
    
    # Format student ID with leading zeros
    student_id=$(printf "ST%04d" $i)
    
    # Create JSON payload
    json="{\"name\": \"$first_name $last_name\", \"studentId\": \"$student_id\"}"
    
    # Send POST request
    curl -X POST http://localhost:3000/students \
        -H "Content-Type: application/json" \
        -d "$json"
    
    echo -e "\nCreated student $i: $first_name $last_name ($student_id)"
    
    # Optional: Add a small delay to avoid overwhelming the server
    sleep 0.1
done