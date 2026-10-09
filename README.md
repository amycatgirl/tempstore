# tempstore

## what is this?

tempstore is an ephemeral file-sharing service written in go.

it initially started as a fun side project originally written in deno,
but was later rewritten in go (also as a fun side project.)

it's main goal is being self-contained, while staying easy to host and
manage.

## running from docker/podman

a container image is  available and hosted on `ghcr`, github's container
registry.

  ghcr.io/amycatgirl/tempstore:latest

this image will also become available on atcr as soon as a proper CI
workflow is set up.


## running from source

first, clone this repository using git. it's hosted both on github and
tangled, with tangled being the "canonical" source

```bash
git clone https://tangled.org/bunniesin.space/tempstore

# alternatively, use the stable identifier
# git clone https://tangled.org/did:plc:sdg4fsumzoev7h2hn3scq4zz
```

the main application lives in `cmd/tempstore` with the server and
assets being available on `internals/server` and `static/assets`.

to start the service, use the `go run` command or [just](https://github.com/casey/just)

> [!NOTE]
> The `just start` task will run with debug diagnostics enabled.

```bash
go run cmd/tempstore serve
# or
just start
```

## flags

to configure the instance, you can pass it command-line flags to the
`serve` command

to learn more about what they do, you can use the built-in `help`
command

## hosting files

to host a file, open the web ui, select a file and retention period
(with a maximum of 5 hours), then upload.

you will then be redirected to where your file lives

this service does not depend on javascript to work successfully, however
aditional (and optional) javascript components may be added in the future.


## programatic use

if you want to create a tool that integrates with tempstore, you can
use the API bundled with it.

it is available on `<your_domain>/api/` and only has one endpoint,
`upload`.

### POST `/api/upload`
- `accepts`: `multipart/form-data`
  - fields:
    - `file`: a blob. currently no file size and attachment type limits
    are imposed, but may be added in the future
    - `until`: a duration in hours, with a hard-coded limit of 5 hours.

this is the same endpoint used by the bundled web ui. it responds with
a redirect to the file url.

## security implications

this service is by no means "secure".

it hasn't been battle tested, nor it has been tested at all (aside from
using it every so often on an isolated environment.)

i recommend using this to share files between close friends and family
under a tunneled connection (i.e. tailscale).

however, nothing is stopping you from hosting this on the public
internet.

feel free to give it an audit and report any issues to the issue tracker
available on [tangled](https://tangled.org/did:plc:sdg4fsumzoev7h2hn3scq4zz).


## license
this project is licensed under the MIT license and i encourage others
to fork this for their own use or to improve the project.

