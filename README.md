# xml-api-schema-openapi-converter
Converts the Kaltura API schema XML to an Open API document

## Usage
```
node refresh.js --schema https://www.kaltura.com/api_v3/api_schema.php --output ./openapi.json
```

`--schema` argument can be a URL or a local file.

You can exclude the `--schema` option by specifying environment variable `TARGET_API` as `ott` or `ovp`, e.g.

```
TARGET_API=ovp node refresh.js
```
