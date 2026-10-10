FROM golang:1.25

WORKDIR /usr/src/tempstore

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -trimpath -ldflags="-s -w" -v -o /usr/local/bin/tempstore ./cmd/tempstore

# Ensure "files" directory is available before running
RUN mkdir -p files

# Default port is 5544
EXPOSE 5544
CMD ["tempstore", "serve"]
