package server

import (
	"context"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	slogecho "github.com/samber/slog-echo"
)

type Server struct {
	echo *echo.Echo
	// todo db
	httpd  *http.Server
	logger *slog.Logger
}

type Args struct {
	Addr  string
	Debug bool
}

func New(args *Args) (*Server, error) {
	level := slog.LevelInfo
	if args.Debug {
		level = slog.LevelDebug
	}

	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		Level: level,
	}))

	e := echo.New()

	e.Use(middleware.Recover())
	e.Use(slogecho.New(logger))

	httpd := http.Server{
		Addr:    args.Addr,
		Handler: e,
	}

	s := Server{
		httpd:  &httpd,
		logger: logger,
		echo:   e,
	}

	return &s, nil
}

// TODO: We want to also pass a context here, since we are going to have tasks running in the background as well!!
func (s *Server) Serve() error {
	shutdownEcho := make(chan struct{})
	echoShutdown := make(chan struct{})

	go func() {
		logger := s.logger.With("component", "echo")

		logger.Info("adding routes")
		s.addRoutes()
		logger.Info("routes added")

		go func() {
			if err := s.httpd.ListenAndServe(); err != http.ErrServerClosed {
				logger.Error("failed to listen", "err", err)
				close(shutdownEcho)
			}
		}()

		logger.Info("listening", "addr", s.httpd.Addr)

		<-shutdownEcho

		logger.Info("shutting down echo")

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)

		defer func() {
			cancel()
			close(echoShutdown)
		}()

		if err := s.httpd.Shutdown(ctx); err != nil {
			logger.Error("failed to shut down server", "err", err)
			return
		}

		s.logger.Info("server shutdown")
	}()

	signals := make(chan os.Signal, 1)
	signal.Notify(signals, syscall.SIGINT, syscall.SIGTERM)

	select {
	// shut down gracefully on signal
	case sig := <-signals:
		s.logger.Info("shutting down on signal", "signal", sig)
		close(shutdownEcho)
	case <-echoShutdown:
		s.logger.Warn("echo shutdown unexpectedly")
	}

	forceShutdownSignals := make(chan os.Signal, 1)
	signal.Notify(forceShutdownSignals, syscall.SIGINT, syscall.SIGTERM)

	var wg sync.WaitGroup

	wg.Go(func() {
		s.logger.Info("waiting up to 5 seconds for echo to shut down")

		select {
		case <-echoShutdown:
			s.logger.Info("echo shutdown gracefully")
		case <-time.After(5 * time.Second):
			s.logger.Warn("echo did not shut down after 5 seconds, exiting forcefully")
		case <-forceShutdownSignals:
			s.logger.Warn("received forceful shutdown signal before echo shutdown")
		}
	})

	s.logger.Info("waiting for routines to finish")
	wg.Wait()

	s.logger.Info("shutdown")

	return nil
}

func (s *Server) addRoutes() {
	s.echo.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello world!")
	})
}
