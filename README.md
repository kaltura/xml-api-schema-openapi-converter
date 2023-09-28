# XML API Schema to Swagger 2 Converter

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
node refresh.js --target ovp --schema https://www.kaltura.com/api_v3/api_schema.php --output ./out/ovp.swagger2.json --genopenapiv3 ./out/ovp.openapi.json --novalidate

node refresh.js --target ott --schema http://phoenix.service.consul:8080/clientlibs/KalturaClient.xml --output ./out/ott.swagger2.json --genopenapiv3 ./out/ott.openapi.json --novalidate
```

### Parameters

* `--target <ovp/ott>` Should be `ovp` or `ott` (default `ovp`)
* `--schema <kaltura_api_schema.xml>` Argument can be a URL or a local file (default is the schema hosted on kaltura.com)
* `--output <filename>` Is the destination file (default is in the `./out/` folder)
* `--novalidate` Will skip validation at the end of generating the new schema
* `--genopenapiv3 <filename>` *Experimental & will likely fail!* Used to generate an OpenAPI 3.x file in addition to the Swagger 2.0  
