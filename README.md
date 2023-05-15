# XML API Schema to OpenAPI 3 Converter

 A tool that convert the Kaltura API XML-based schema to an OpenAPI 3 compliant json file.

## Requirements

node v14.21.3 (npm v6.14.18)  
**Note: This project is designed to run as a local dev tool**  
It should never be run in production servers, only as a local dev tool.

## To install

```bash
npm install
```

## To run

```bash
node refresh.js --target ovp --schema <xml-schema-file> --output <output-file>
```

### For example (Kaltura.com core services schema)

```bash
node refresh.js --target ovp --schema https://www.kaltura.com/api_v3/api_schema.php --output ./openapi.json
```

### Parameters

* `--target` Should be `ovp` or `ott` (default `ovp`)
* `--schema` Argument can be a URL or a local file (default is the schema hosted on kaltura.com)
* `--output` Is the destination file (default is in the `./out/` folder)
* `--novalidate` Will skip validation at the end of generating the new schema
