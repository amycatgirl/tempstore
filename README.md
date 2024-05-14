# Tempstore
No nonsense, self-hostable temporary file service

## Running
```
just run
```

## Usage

### Create a new object/file

Route: `/create`

Method: `POST`

Content Type: `multipart/form-data`

Body
- `file`: self-explanatory
- `until`: Amount of time to store the file for (in hours)

### Get object/file

Route `/objects/:id`

Method: `GET`
