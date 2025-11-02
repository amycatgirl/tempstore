FROM golang:1.25

WORKDIR /usr/src/tempstore

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -v -o /usr/local/bin/tempstore ./...

# Default port is 5544
CMD ["tempstore", "serve"]
