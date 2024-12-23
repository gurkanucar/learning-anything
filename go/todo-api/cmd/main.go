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
