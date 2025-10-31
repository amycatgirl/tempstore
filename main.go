package main

import (
	"fmt"
	"time"

	"github.com/amycatgirl/tempstore/tempstore/server"
)

func main() {
	temp_duration, err := time.ParseDuration("30s")
	if err != nil {
		panic(fmt.Errorf("failed to parse duration: %w", err))
	}

	s, err := server.New(
		&server.Args{
			DatabasePath:  "tempstore.db",
			Addr:          ":8080",
			CheckInterval: temp_duration,
		},
	)

	if err != nil {
		// worlds most god awful error handling in existance
		panic(err)
	}

	s.Serve()
}
