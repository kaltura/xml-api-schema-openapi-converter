var FS = require('fs');
var Converter = require('api-spec-converter');
var Kaltura = require('./lib/kaltura-spec');

Converter.convert({
  from: 'kaltura',
  to: 'swagger_2',
  source: 'http://www.kaltura.com/api_v3/api_schema.php'
}, function(err, spec) {
  if (err) console.log(err);
  FS.writeFileSync('out/swagger.json', spec.stringify());
});
