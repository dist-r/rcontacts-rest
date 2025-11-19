package config

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

func getEnv(key, fallback string) string {
	val := os.Getenv(key)
	if val == "" {
		return fallback
	}
	return val
}

var DB *pgxpool.Pool

func InitDB() {
	user := getEnv("POSTGRES_USER", "pgdb")
	password := getEnv("POSTGRES_PASSWORD", "pgdb")
	host := getEnv("POSTGRES_HOST", "localhost")
	port := getEnv("POSTGRES_PORT", "5432")
	dbname := getEnv("POSTGRES_DB", "pgdb")

	dsn := "postgres://" + user + ":" + password + "@" + host + ":" + port + "/" + dbname + "?sslmode=disable"
	fmt.Println("Connecting to Postgres with DSN:", dsn)

	cfg, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		log.Fatal("pgx config error: ", err)
	}

	cfg.MaxConns = 10
	cfg.MinConns = 2
	cfg.MaxConnIdleTime = 5 * time.Minute

	pool, err := pgxpool.NewWithConfig(context.Background(), cfg)
	if err != nil {
		log.Fatal("pgx connect error:", err)
	}

	DB = pool
	log.Println("Connected to PostgreSQL via pgxpool")
}
