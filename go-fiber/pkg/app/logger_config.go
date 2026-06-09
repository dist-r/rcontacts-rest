package app

import (
	"log/slog"
	"os"
	"strings"
)

// LogConfig holds the logging configuration
type LogConfig struct {
	Level  slog.Level
	Format string
}

// NewLogConfig creates a new log configuration from environment
func NewLogConfig() *LogConfig {
	level := parseLogLevel(os.Getenv("LOG_LEVEL"))
	format := strings.ToLower(os.Getenv("LOG_FORMAT"))
	if format != "json" && format != "text" {
		format = "json"
	}

	return &LogConfig{
		Level:  level,
		Format: format,
	}
}

// parseLogLevel converts a string to slog.Level
func parseLogLevel(levelStr string) slog.Level {
	switch strings.ToLower(levelStr) {
	case "debug":
		return slog.LevelDebug
	case "info":
		return slog.LevelInfo
	case "warn":
		return slog.LevelWarn
	case "error":
		return slog.LevelError
	default:
		return slog.LevelInfo
	}
}

// InitLogger initializes and returns the logger based on config
func InitLogger(config *LogConfig) ILogger {
	if config.Format == "text" {
		return NewTextSlogLogger(config.Level)
	}
	return NewSlogLogger(config.Level)
}

// InitLoggerWithLevel initializes logger with specific level
func InitLoggerWithLevel(level slog.Level, format string) ILogger {
	config := &LogConfig{
		Level:  level,
		Format: format,
	}
	return InitLogger(config)
}
