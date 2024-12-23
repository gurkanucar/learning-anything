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
