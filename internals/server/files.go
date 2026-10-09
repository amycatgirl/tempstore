package server

import (
	"errors"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
)

func fileExists(path string) bool {
	_, err := os.Stat(path)

	if err == nil {
		return true
	}

	if errors.Is(err, os.ErrNotExist) {
		return false
	}

	return false
}

func (s *Server) filesRoute(c echo.Context) error {
	id := c.Param("id")
	blob, err := s.database.GetBlob(id)
	if err != nil {
		return c.NoContent(http.StatusNotFound)
	}

	if !fileExists("files/" + blob.CanonicalFilename) {
		return c.String(http.StatusInternalServerError, "File is missing but ID is still dangling. Contact this instance's operator for more information.")
	}

	return c.File("files/" + blob.CanonicalFilename)
}
