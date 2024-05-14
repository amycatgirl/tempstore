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

## usage

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
