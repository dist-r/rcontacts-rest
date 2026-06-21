package config

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

func NewMySQLDB() (*sql.DB, error) {
	password := os.Getenv("MYSQL_PASSWORD")
	user := os.Getenv("MYSQL_USER")
	dbName := os.Getenv("MYSQL_DATABASE")
	port := os.Getenv("MYSQL_PORT")
	dsn := user + ":" + password + "@tcp(localhost:" + port + ")/" + dbName
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, err
	}
	// Test the connection
	if err := db.Ping(); err != nil {
		return nil, err
	}
	fmt.Println("MySQL connected")
	return db, nil
}
