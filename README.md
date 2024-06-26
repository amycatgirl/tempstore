# tempstore
no nonsense, self-hostable temporary file service

## running

create a folder called `tmpst` at the root of this repository, then run

```
DOMAIN="https://example.com" just run
```

or 

```
DOMAIN="https://example.com" deno task start
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

route: `/create`

method: `POST`

content Type: `multipart/form-data`

body
- `file`: self-explanatory
- `until`: Amount of time to store the file for (in hours)

### get object/file

route `/objects/:id`

method: `GET`

## demostration

[simplescreenrecorder-2024-06-03_10.43.30.webm](https://github.com/amycatgirl/tempstore/assets/138383945/a97d85c7-729d-4e33-83fd-6c5af770d2fa)
