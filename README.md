# XML API Schema to OpenAPI 3 Converter

 A tool that convert the Kaltura API XML-based schema to an OpenAPI 3 compliant json file.

## Requirements

Minimum version: node v14.21.3 / npm v6.14.18  
**Last tested with**:  node v20.1.0 / npm v9.6.4 - *this is also the current package.json*

## To install

```bash
npm install
```

### If you don't have package.json

```bash
npm install yargs
npm install api-spec-converter
```

After installing the packages, you will be able to run the converter

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
