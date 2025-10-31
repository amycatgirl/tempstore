package server

import (
	"io"
	"net/http"
	"os"
	"time"

	"github.com/labstack/echo/v4"
)

func (s *Server) handleUpload(c echo.Context) error {
	until := c.FormValue("until")
	duration, err := time.ParseDuration(until + "h")
	if err != nil {
		return err
	}

	now := time.Now()
	exptime := now.Add(duration)

	file, err := c.FormFile("file")
	if err != nil {
		return err
	}

	if err := s.database.NewBlob(file.Filename, exptime); err != nil {
		return err
	}

	src, err := file.Open()
	if err != nil {
		return err
	}

	defer src.Close()

	dst, err := os.Create("files/" + file.Filename)
	if err != nil {
		return err
	}
	defer dst.Close()

	if _, err := io.Copy(dst, src); err != nil {
		return err
	}

	return c.Redirect(http.StatusFound, "/files/"+file.Filename)
}
