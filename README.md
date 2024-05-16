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
