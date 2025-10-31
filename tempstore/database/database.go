package database

import (
	"fmt"
	"log/slog"
	"os"
	"time"

	"github.com/oklog/ulid/v2"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Database struct {
	db     *gorm.DB
	logger *slog.Logger
}

type Args struct {
	DatabasePath string
	Debug        bool
}

func New(args *Args) (*Database, error) {
	level := slog.LevelInfo
	if args.Debug {
		level = slog.LevelDebug
	}

	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		Level: level,
	}))

	logger = logger.With("component", "database")

	gormDB, err := gorm.Open(sqlite.Open(args.DatabasePath))

	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	if err := gormDB.AutoMigrate(&Blob{}); err != nil {
		return nil, fmt.Errorf("failed to apply migrations: %w", err)
	}

	db := Database{
		db:     gormDB,
		logger: logger,
	}

	return &db, nil
}

func (db *Database) getExpiredBlobs() ([]Blob, error) {
	var blobs []Blob
	if err := db.db.Where("expires_at < ?", time.Now()).Find(&blobs).Error; err != nil {
		return nil, fmt.Errorf("failed to query database: %w", err)
	}

	return blobs, nil
}

func (db *Database) DeleteExpiredBlobs() error {
	blobs, err := db.getExpiredBlobs()
	if err != nil {
		return err
	}

	for _, blob := range blobs {
		if err := blob.deleteUnderlyingFile(); err != nil {
			return err
		}
		db.db.Delete(&blob)
	}

	return nil
}

func (db *Database) NewBlob(filename string, expires_at time.Time) error {
	blob := &Blob{
		ID:                ulid.Make().String(),
		CanonicalFilename: filename,
		ExpiresAt:         expires_at,
	}

	if err := db.db.Create(&blob).Error; err != nil {
		return err
	}

	return nil
}
