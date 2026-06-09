// Package main is the entry point for the Furab API Gateway.
// The API Gateway acts as a reverse proxy, routing requests to the appropriate microservice.
package main

import (
	"log"
	"net/http"

	"furab-backend/gateway/api-gateway/internal/router"
	"furab-backend/shared/config"
	sharedlogger "furab-backend/shared/logger"
)

func main() {
	cfg := config.Load("api-gateway")
	logger := sharedlogger.New(cfg.ServiceName, cfg.Environment)

	logger.Info("starting api-gateway", "port", cfg.ServerPort)

	r := router.NewRouter()

	logger.Info("api-gateway listening", "address", cfg.ServerAddr())
	if err := http.ListenAndServe(cfg.ServerAddr(), r); err != nil {
		log.Fatalf("api-gateway error: %v", err)
	}
}
