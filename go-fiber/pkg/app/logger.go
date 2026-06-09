package app

import (
	"context"
	"fmt"
	"log/slog"
	"os"
)

// SlogLogger is an implementation of ILogger using slog
type SlogLogger struct {
	handler *slog.Logger
}

// NewSlogLogger creates a new SlogLogger instance
func NewSlogLogger(level slog.Level) *SlogLogger {
	opts := &slog.HandlerOptions{
		Level: level,
	}

	handler := slog.New(slog.NewJSONHandler(os.Stdout, opts))
	return &SlogLogger{handler: handler}
}

// NewTextSlogLogger creates a new SlogLogger with text format
func NewTextSlogLogger(level slog.Level) *SlogLogger {
	opts := &slog.HandlerOptions{
		Level: level,
	}

	handler := slog.New(slog.NewTextHandler(os.Stdout, opts))
	return &SlogLogger{handler: handler}
}

// Debug logs a debug level message
func (s *SlogLogger) Debug(msg string, attrs ...any) {
	s.logWithAttrs(slog.LevelDebug, msg, attrs...)
}

// Info logs an info level message
func (s *SlogLogger) Info(msg string, attrs ...any) {
	s.logWithAttrs(slog.LevelInfo, msg, attrs...)
}

// Warn logs a warning level message
func (s *SlogLogger) Warn(msg string, attrs ...any) {
	s.logWithAttrs(slog.LevelWarn, msg, attrs...)
}

// Error logs an error level message
func (s *SlogLogger) Error(msg string, attrs ...any) {
	s.logWithAttrs(slog.LevelError, msg, attrs...)
}

// logWithAttrs is a helper method to log with attributes
func (s *SlogLogger) logWithAttrs(level slog.Level, msg string, attrs ...any) {
	if !s.handler.Enabled(context.Background(), level) {
		return
	}

	var slogAttrs []slog.Attr

	if len(attrs) == 1 {
		slogAttrs = append(slogAttrs, slog.Any("data", attrs[0]))
	} else {
		for i := 0; i < len(attrs); i += 2 {
			if i+1 < len(attrs) {
				key, ok := attrs[i].(string)
				if ok {
					slogAttrs = append(slogAttrs, slog.Any(key, attrs[i+1]))
				} else {
					slogAttrs = append(slogAttrs, slog.Any(fmt.Sprintf("arg%d", i), attrs[i]))
					slogAttrs = append(slogAttrs, slog.Any(fmt.Sprintf("arg%d", i+1), attrs[i+1]))
				}
			} else {
				slogAttrs = append(slogAttrs, slog.Any(fmt.Sprintf("arg%d", i), attrs[i]))
			}
		}
	}

	s.handler.LogAttrs(context.Background(), level, msg, slogAttrs...)
}

// GetLevel returns the logger instance for advanced usage
func (s *SlogLogger) GetLogger() *slog.Logger {
	return s.handler
}
