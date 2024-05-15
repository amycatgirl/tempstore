# tempstore
no nonsense, self-hostable temporary file service

## running

create a folder called `tmpst` at the root of this repository, then run

```
just run
```

or 

```
deno task start
```

a dockerfile is available for you to build, you need to expose port `5544` on podman/docker

image builds coming soon

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
