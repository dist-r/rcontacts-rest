package config

import (
	"context"
	"fmt"
	"log"
	"os"

	// "strconv"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

var DB *pgxpool.Pool

func InitDB() {
	isDocker := os.Getenv("DOCKER_ENV") == "true"
	fmt.Println("Docker Env:", isDocker)

	user := os.Getenv("POSTGRES_USER")
	password := os.Getenv("POSTGRES_PASSWORD")
	dbname := os.Getenv("POSTGRES_DB")
	port := os.Getenv("POSTGRES_PORT")
	fmt.Println(user, password, dbname, port)

	var host string
	if isDocker {
		host = os.Getenv("POSTGRES_HOST_COMPOSE")
	} else {
		host = os.Getenv("POSTGRES_HOST")
	}

	dsn := "postgres://" + user + ":" + password + "@" + host + ":" + port + "/" + dbname + "?sslmode=disable"

	cfg, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		log.Fatal("pgx config error:", err)
	}

	cfg.MaxConns = 10
	cfg.MinConns = 2
	cfg.MaxConnIdleTime = 5 * time.Minute

	time.Sleep(4 * time.Second)

	pool, err := pgxpool.NewWithConfig(context.Background(), cfg)
	if err != nil {
		log.Fatal("pgx connect error:", err)
	}

	DB = pool
}
