package main

import (
	"context"
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Student struct {
	ID        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name      string             `json:"name" bson:"name"`
	StudentID string             `json:"studentId" bson:"studentId"`
}

type Attendance struct {
	ID       primitive.ObjectID  `json:"id" bson:"_id,omitempty"`
	LessonID string              `json:"lessonId" bson:"lessonId"`
	Date     time.Time           `json:"date" bson:"date"`
	Students []AttendanceStudent `json:"students" bson:"students"`
}

type AttendanceStudent struct {
	StudentID string `json:"studentId" bson:"studentId"`
	Present   bool   `json:"present" bson:"present"`
}

var db *mongo.Database

func connectDB() error {
	// MongoDB connection with retry logic
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Connection options
	clientOptions := options.Client().
		ApplyURI("mongodb://admin:password123@localhost:27017/?authSource=admin").
		SetServerSelectionTimeout(5 * time.Second)

	// Connect to MongoDB
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		return err
	}

	// Ping the database
	err = client.Ping(ctx, nil)
	if err != nil {
		return err
	}

	db = client.Database("attendance_system")

	// Create indexes
	_, err = db.Collection("students").Indexes().CreateOne(
		context.Background(),
		mongo.IndexModel{
			Keys:    bson.D{{Key: "studentId", Value: 1}},
			Options: options.Index().SetUnique(true),
		},
	)
	if err != nil {
		log.Printf("Error creating index: %v", err)
	}

	log.Println("Connected to MongoDB!")
	return nil
}

func realTimeAttendance(c *fiber.Ctx) error {
	if websocket.IsWebSocketUpgrade(c) {
		return c.Next()
	}
	return c.Status(fiber.StatusUpgradeRequired).SendString("Upgrade required")
}

func attendanceSocket(c *websocket.Conn) {
	defer c.Close()
	for {
		// Send updated attendance data periodically
		var attendances []Attendance
		cursor, err := db.Collection("attendance").Find(context.Background(), bson.M{})
		if err != nil {
			log.Println("Failed to fetch attendance data:", err)
			break
		}
		if err := cursor.All(context.Background(), &attendances); err != nil {
			log.Println("Failed to parse attendance data:", err)
			break
		}
		cursor.Close(context.Background())

		// Send data as JSON
		if err := c.WriteJSON(attendances); err != nil {
			log.Println("Error sending attendance data:", err)
			break
		}

		// Update every 5 seconds (adjust as needed)
		time.Sleep(5 * time.Second)
	}
}

func main() {
	// Connect to MongoDB with retry
	maxRetries := 5
	for i := 0; i < maxRetries; i++ {
		err := connectDB()
		if err != nil {
			log.Printf("Failed to connect to MongoDB (attempt %d/%d): %v", i+1, maxRetries, err)
			if i < maxRetries-1 {
				time.Sleep(5 * time.Second)
				continue
			}
			log.Fatal("Could not connect to MongoDB after all retries")
		}
		break
	}

	app := fiber.New(fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			log.Printf("Error: %v", err)
			return c.Status(500).JSON(fiber.Map{
				"error":   "Internal Server Error",
				"details": err.Error(),
			})
		},
	})

	// Student routes
	app.Post("/students", createStudent)
	app.Get("/students", listStudents)

	// Attendance routes
	app.Post("/attendance", createAttendance)
	app.Get("/attendance/:lessonId/:date", getAttendance)
	app.Put("/attendance/:id/mark", markAttendance)

	app.Get("/ws/attendance", websocket.New(attendanceSocket))

	log.Println("Server starting on :3000")
	log.Fatal(app.Listen(":3000"))
}

func createStudent(c *fiber.Ctx) error {
	student := new(Student)
	if err := c.BodyParser(student); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request", "details": err.Error()})
	}

	// Check if student already exists
	var existingStudent Student
	err := db.Collection("students").FindOne(context.Background(), bson.M{"studentId": student.StudentID}).Decode(&existingStudent)
	if err == nil {
		return c.Status(400).JSON(fiber.Map{"error": "Student ID already exists"})
	} else if err != mongo.ErrNoDocuments {
		return c.Status(500).JSON(fiber.Map{"error": "Database error", "details": err.Error()})
	}

	result, err := db.Collection("students").InsertOne(context.Background(), student)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create student", "details": err.Error()})
	}

	student.ID = result.InsertedID.(primitive.ObjectID)
	return c.Status(201).JSON(student)
}

func listStudents(c *fiber.Ctx) error {
	ctx := context.Background()

	var students []Student
	cursor, err := db.Collection("students").Find(ctx, bson.M{})
	if err != nil {
		log.Printf("Database error in listStudents: %v", err)
		return c.Status(500).JSON(fiber.Map{
			"error":   "Failed to fetch students",
			"details": err.Error(),
		})
	}
	defer cursor.Close(ctx)

	if err := cursor.All(ctx, &students); err != nil {
		log.Printf("Cursor error in listStudents: %v", err)
		return c.Status(500).JSON(fiber.Map{
			"error":   "Failed to parse students",
			"details": err.Error(),
		})
	}

	return c.JSON(students)
}

func createAttendance(c *fiber.Ctx) error {
	attendance := new(Attendance)

	// Parse JSON body into a map to handle custom date parsing
	var payload map[string]interface{}
	if err := c.BodyParser(&payload); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request", "details": err.Error()})
	}

	// Parse date string into time.Time
	dateStr, ok := payload["date"].(string)
	if !ok {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid date format"})
	}

	date, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid date format", "details": err.Error()})
	}

	// Assign parsed date and other fields to Attendance
	attendance.Date = date
	attendance.LessonID = payload["lessonId"].(string)

	// Initialize attendance with all students (marked as absent)
	var students []Student
	cursor, err := db.Collection("students").Find(context.Background(), bson.M{})
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch students"})
	}
	defer cursor.Close(context.Background())

	if err := cursor.All(context.Background(), &students); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to parse students"})
	}

	attendance.Students = make([]AttendanceStudent, len(students))
	for i, student := range students {
		attendance.Students[i] = AttendanceStudent{
			StudentID: student.StudentID,
			Present:   false,
		}
	}

	// Insert attendance into MongoDB
	result, err := db.Collection("attendance").InsertOne(context.Background(), attendance)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create attendance"})
	}

	attendance.ID = result.InsertedID.(primitive.ObjectID)
	return c.JSON(attendance)
}

func getAttendance(c *fiber.Ctx) error {
	lessonID := c.Params("lessonId")
	dateStr := c.Params("date")

	date, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid date format"})
	}

	// Find attendance for the specific lesson and date
	var attendance Attendance
	err = db.Collection("attendance").FindOne(context.Background(), bson.M{
		"lessonId": lessonID,
		"date": bson.M{
			"$gte": date,
			"$lt":  date.Add(24 * time.Hour),
		},
	}).Decode(&attendance)

	if err == mongo.ErrNoDocuments {
		return c.Status(404).JSON(fiber.Map{"error": "Attendance not found"})
	} else if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch attendance"})
	}

	return c.JSON(attendance)
}

func markAttendance(c *fiber.Ctx) error {
	type MarkAttendanceRequest struct {
		StudentID string `json:"studentId"`
		Present   bool   `json:"present"`
	}

	attendanceID, err := primitive.ObjectIDFromHex(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid attendance ID"})
	}

	req := new(MarkAttendanceRequest)
	if err := c.BodyParser(req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	// Update the student's attendance status
	result, err := db.Collection("attendance").UpdateOne(
		context.Background(),
		bson.M{
			"_id":                attendanceID,
			"students.studentId": req.StudentID,
		},
		bson.M{
			"$set": bson.M{"students.$.present": req.Present},
		},
	)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update attendance"})
	}

	if result.MatchedCount == 0 {
		return c.Status(404).JSON(fiber.Map{"error": "Attendance or student not found"})
	}

	return c.JSON(fiber.Map{"message": "Attendance marked successfully"})
}
