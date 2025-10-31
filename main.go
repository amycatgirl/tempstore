package main

import (
	"github.com/amycatgirl/tempstore/tempstore/server"
)

func main() {
	s, err := server.New(
		&server.Args{
			Addr: ":8080",
		},
	)

	if err != nil {
		// worlds most god awful error handling in existance
		panic(err)
	}

	s.Serve()
}
