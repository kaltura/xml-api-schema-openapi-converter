var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var schemas = [{
  label: 'Syndication Feed',
  type: 'syndication',
}, {
  label: 'Bulk Upload',
  type: 'bulkUploadXml.bulkUploadXML',
}, {
  label: 'Bulk Upload Results',
  type: 'bulkUploadXml.bulkUploadResultXML',
}, {
  label: 'Cue Point Serve',
  type: 'cuePoint.serveAPI',
}, {
  label: 'Cue Point Ingest',
  type: 'cuePoint.ingestAPI',
}, {
  label: 'Drop Folder',
  type: 'dropFolderXmlBulkUpload.dropFolderXml',
}]

schemas.forEach(function(s) {
  s.downloadURL = 'http://www.kaltura.com/api_v3/index.php/service/schema/action/serve/type/' + s.type + '/name/' + s.type + '.xsd';
  s.htmlURL = 'http://www.kaltura.com/api_v3/xsdDoc/index.php?type=' + s.type;
  s.xsdFilename = __dirname + '/schemas/' + s.type + '.xsd';
  s.htmlFilename = __dirname + '/schemas/html/' + s.type + '.html';
  s.html = fs.readFileSync(s.htmlFilename, 'utf8');
  s.xml = fs.readFileSync(s.xsdFilename, 'utf8');
})

var SCHEMA_MD = fs.readFileSync(__dirname + '/schema.md', 'utf8');

function getContents(s) {
  return SCHEMA_MD.replace('{{ label }}', s.label).replace('{{ html }}', s.html);
}

module.exports = schemas.map(function(s) {
  return {
    title: s.label,
    contents: getContents(s),
  }
});

if (require.main === module) {
  schemas.forEach(function(s) {
    request.get(s.downloadURL, function(err, resp, body) {
      if (err || resp.statusCode !== 200) throw new Error(err || resp.statusCode);
      fs.writeFileSync(s.xsdFilename, body);
      request.get(s.htmlURL, function(err, resp, body) {
        if (err || resp.statusCode !== 200) throw new Error(err || resp.statusCode);
        var $ = cheerio.load(body);
        fs.writeFileSync(s.htmlFilename, $('#doc').html());
      })
    })
  })
}
