# OpenAPI Transformer
It's more than meets the eye!

## Building
After cloning the repository, just do this:

```bash
$ npm install
$ npm run build
```

This will produce a number of JS file in the `build` directory, including `cli.js`.

## Running
The application is a simple CLI tool.  You can get usage information by doing this:

```bash
$ ./build/cli.js help
cli.js [command]

Commands:
  cli.js transform <inputSpec>              Transform an OpenAPI specification
  <outputSpec>

Options:
      --version  Show version number                                   [boolean]
  -h, --help     Show help                                             [boolean]
```

Transform the included sample OpenAPI specification by doing this:

```bash
$ ./build/cli.js transform openapi.json openapi-transformed.json
```

This will result in a new file called `openapi-transformed.json`.  Feel free to then 
diff that file with the original to see the changes.
