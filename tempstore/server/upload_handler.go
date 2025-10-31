package server

import (
	"io"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
)

func handleUpload(c echo.Context) error {
	expiration_time := c.FormValue("until")
	c.Logger().Debug("requested expiration time", "exp", expiration_time)
	file, err := c.FormFile("file")
	if err != nil {
		return err
	}

	src, err := file.Open()
	if err != nil {
		return err
	}

	defer src.Close()

	dst, err := os.Create("static/" + file.Filename)
	if err != nil {
		return err
	}
	defer dst.Close()

	if _, err := io.Copy(dst, src); err != nil {
		return err
	}

	return c.JSON(http.StatusOK, map[string]string{
		"status":      "success",
		"destination": c.Echo().Server.Addr + file.Filename,
	})
}
