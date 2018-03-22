# xml-api-schema-openapi-converter
Converts the Kaltura API schema XML to an Open API document

## Usage
```
node refresh.js --target ovp --schema https://www.kaltura.com/api_v3/api_schema.php --output ./openapi.json
```

* `--target` shoudl be `ovp` or `ott` (default `ovp`)
* `--schema` argument can be a URL or a local file (default is the schema hosted on kaltura.com)
* `--output` is the destination file (default is in the `./out/` folder)

