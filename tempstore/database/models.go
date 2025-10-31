package database

import (
	"fmt"
	"os"
	"time"
)

type Blob struct {
	ID                string
	CreatedAt         time.Time
	CanonicalFilename string
}

func (b *Blob) resolvePath() string {
	return "static/" + b.ID
}

func (b *Blob) deleteUnderlyingFile() error {
	if err := os.Remove(b.resolvePath()); err != nil {
		return fmt.Errorf("failed to remove underlying file for blob %s: %w", b.ID, err)
	}

	return nil
}
