# Go TODO API with Fiber and PostgreSQL

A simple RESTful API for managing TODO tasks using Go, Fiber framework, and PostgreSQL database.

## Prerequisites

- Go 1.16 or higher
- PostgreSQL
- Docker (optional)

## Project Structure

```
todo-api/
├── cmd/
│   └── main.go
└── app/
    ├── db/
    │   └── db.go
    ├── models/
    │   └── task.go
    ├── handlers/
    │   └── task.go
    └── routes/
        └── routes.go
```

## Setup Instructions

### 1. Initialize the Project

```bash
mkdir todo-api
cd todo-api
go mod init todo-api
```

### 2. Install Dependencies

```bash
go get github.com/gofiber/fiber/v2
go get github.com/jackc/pgx/v5
go get github.com/gofiber/fiber/v2/middleware/logger
```

### 3. Database Setup

#### Using Docker (Recommended)

Run PostgreSQL container:

```bash
docker run --name todo-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=todo_db \
  -p 5432:5432 \
  -d postgres
```

#### Create Database Schema

Connect to PostgreSQL and create the tasks table:

```sql
CREATE DATABASE todo_db;

\c todo_db

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE
);
```

## Implementation

### 1. Database Connection (app/db/db.go)

```go
package db

import (
    "context"
    "log"
    "github.com/jackc/pgx/v5/pgxpool"
)

var Pool *pgxpool.Pool

func ConnectDB() {
    var err error
    Pool, err = pgxpool.New(context.Background(), "postgres://username:password@localhost:5432/todo_db")
    if err != nil {
        log.Fatalf("Unable to connect to database: %v\n", err)
    }
    log.Println("Connected to the database!")
}

func CloseDB() {
    Pool.Close()
}
```

### 2. Task Model (app/models/task.go)

```go
package models

type Task struct {
    ID        int    `json:"id"`
    Title     string `json:"title"`
    Completed bool   `json:"completed"`
}
```

### 3. Handlers (app/handlers/task.go)

```go
package handlers

import (
    "context"
    "strconv"
    "todo-api/app/db"
    "todo-api/app/models"
    "github.com/gofiber/fiber/v2"
)

// Get all tasks
func GetTasks(c *fiber.Ctx) error {
    rows, err := db.Pool.Query(context.Background(), "SELECT id, title, completed FROM tasks")
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
    }
    defer rows.Close()

    tasks := []models.Task{}
    for rows.Next() {
        var task models.Task
        err := rows.Scan(&task.ID, &task.Title, &task.Completed)
        if err != nil {
            return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
        }
        tasks = append(tasks, task)
    }
    return c.JSON(tasks)
}

// Create a new task
func CreateTask(c *fiber.Ctx) error {
    task := new(models.Task)
    if err := c.BodyParser(task); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
    }

    _, err := db.Pool.Exec(context.Background(), "INSERT INTO tasks (title, completed) VALUES ($1, $2)", 
        task.Title, task.Completed)
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
    }
    return c.Status(fiber.StatusCreated).JSON(task)
}

// Update a task
func UpdateTask(c *fiber.Ctx) error {
    id, err := strconv.Atoi(c.Params("id"))
    if err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid task ID"})
    }

    task := new(models.Task)
    if err := c.BodyParser(task); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
    }

    _, err = db.Pool.Exec(context.Background(), "UPDATE tasks SET title = $1, completed = $2 WHERE id = $3", 
        task.Title, task.Completed, id)
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
    }
    return c.JSON(task)
}

// Delete a task
func DeleteTask(c *fiber.Ctx) error {
    id, err := strconv.Atoi(c.Params("id"))
    if err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid task ID"})
    }

    _, err = db.Pool.Exec(context.Background(), "DELETE FROM tasks WHERE id = $1", id)
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
    }
    return c.SendStatus(fiber.StatusNoContent)
}
```

### 4. Routes (app/routes/routes.go)

```go
package routes

import (
    "todo-api/app/handlers"
    "github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
    api := app.Group("/api")
    api.Get("/tasks", handlers.GetTasks)
    api.Post("/tasks", handlers.CreateTask)
    api.Put("/tasks/:id", handlers.UpdateTask)
    api.Delete("/tasks/:id", handlers.DeleteTask)
}
```

### 5. Main Application (cmd/main.go)

```go
package main

import (
    "log"
    "todo-api/app/db"
    "todo-api/app/routes"
    "github.com/gofiber/fiber/v2"
    "github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
    // Connect to database
    db.ConnectDB()
    defer db.CloseDB()

    // Create Fiber app
    app := fiber.New()

    // Middleware
    app.Use(logger.New())

    // Setup routes
    routes.SetupRoutes(app)

    // Start server
    log.Fatal(app.Listen(":3000"))
}
```

## Running the Application

1. Start PostgreSQL (if using Docker):
```bash
docker start todo-postgres
```

2. Run the application:
```bash
go run cmd/main.go
```

## API Endpoints

Test the API using curl commands:

### Get All Tasks
```bash
curl -X GET http://localhost:3000/api/tasks
```

### Create a Task
```bash
curl -X POST http://localhost:3000/api/tasks \
-H "Content-Type: application/json" \
-d '{"title": "Learn Go", "completed": false}'
```

### Update a Task
```bash
curl -X PUT http://localhost:3000/api/tasks/1 \
-H "Content-Type: application/json" \
-d '{"title": "Learn Go and Fiber", "completed": true}'
```

### Delete a Task
```bash
curl -X DELETE http://localhost:3000/api/tasks/1
```

## Docker Management Commands

### Start PostgreSQL Container
```bash
docker start todo-postgres
```

### Stop PostgreSQL Container
```bash
docker stop todo-postgres
```

### Remove PostgreSQL Container
```bash
docker rm todo-postgres
```

## Notes

- Remember to replace the database connection string in `db.go` with your actual PostgreSQL credentials
- The API runs on port 3000 by default
- All endpoints are prefixed with `/api`
- Make sure PostgreSQL is running before starting the application