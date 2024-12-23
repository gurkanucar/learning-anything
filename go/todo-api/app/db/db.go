package db

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)

var Pool *pgxpool.Pool

func ConnectDB() {
	var err error
	Pool, err = pgxpool.New(context.Background(), "postgres://postgres:yourpassword@localhost:5432/todo_db")
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}
	log.Println("Connected to the database!")
}

func CloseDB() {
	Pool.Close()
}
