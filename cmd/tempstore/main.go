package main

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/amycatgirl/tempstore/internals/server"
	"github.com/urfave/cli/v3"
)

func main() {
	cmd := &cli.Command{
		Name:  "tempstore",
		Usage: "Temporary static file host",
		Commands: []*cli.Command{
			{
				Name:  "serve",
				Usage: "Serve web application and API endpoints",
				Flags: []cli.Flag{
					&cli.StringFlag{
						Name:  "addr",
						Value: ":5544",
						Usage: "Address to host the server to",
					},
					&cli.StringFlag{
						Name:  "db-path",
						Value: "tempstore.db",
						Usage: "Database path",
					},
					&cli.BoolFlag{
						Name:  "debug",
						Value: false,
						Usage: "Enable debug logging",
					},
					&cli.DurationFlag{
						Name:  "deletion-interval",
						Value: time.Minute,
						Usage: "Time before deleting expired files",
					},
				},
				Action: func(ctx context.Context, cmd *cli.Command) error {
					s, err := server.New(&server.Args{
						DatabasePath:  cmd.String("db-path"),
						Addr:          cmd.String("addr"),
						Debug:         cmd.Bool("debug"),
						CheckInterval: cmd.Duration("deletion-interval"),
					})

					if err != nil {
						log.Fatal("Failed to start server", "err", err)
					}

					s.Serve(ctx)
					return nil
				},
			},
		},
	}

	if err := cmd.Run(context.Background(), os.Args); err != nil {
		log.Fatal(err)
	}
}
