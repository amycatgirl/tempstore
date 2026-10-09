build:
    go build ./cmd/tempstore

start:
    @echo "Starting development server in port :5544"
    go run ./cmd/tempstore -- serve --debug
