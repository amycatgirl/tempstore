# tempstore

no nonsense, self-hostable temporary file service

## running

create a folder called `tmpst` at the root of this repository, then run

```bash
DOMAIN="https://example.com" just run
```

or

```bash
DOMAIN="https://example.com" deno task start
```

If you want to use a custom port, edit the `PORT` environment variable

```bash
PORT="3000" deno task start
```

### docker/podman

an image for docker/podman containers is available at `ghcr.io/amycatgirl/tempstore:latest`

set the `DOMAIN` environment variable to the domain you are using to host tempstore.

## usage

go to `localhost:5544`

upload file

use id with the `/object/:id` route (replace `:id` with your id)

## API

### create a new object/file

route: `/api/object`

method: `POST`

content Type: `multipart/form-data`

body

- `file`: self-explanatory
- `until`: Amount of time to store the file for (in hours)

### get object/file

route `/api/object/:id`

method: `GET`

## demostration

[simplescreenrecorder-2024-06-03_10.43.30.webm](https://github.com/amycatgirl/tempstore/assets/138383945/a97d85c7-729d-4e33-83fd-6c5af770d2fa)
