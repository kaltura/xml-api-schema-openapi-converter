var fs = require('fs');

var CLIENT_LIB_MD = fs.readFileSync(__dirname + '/../markdown/client_libraries.md', 'utf8');
var CLIENT_LANGS = ['php5', 'php53', 'php5Zend', 'csharp', 'ruby', 'java', 'android', 'js', 'python', 'objc', 'cli', 'node'];
/*
var genDate = fs.readFileSync(__dirname + '/../node_modules/kaltura-schema/api_schema.xml', 'utf8').match(/generatedDate="(\d+)"/)[1];
genDate = new Date(parseInt(genDate) * 1000);
var year = (genDate.getYear() + 1900).toString();
var month = (genDate.getMonth() + 1).toString();
if (month.length === 1) month = '0' + month;
var day = genDate.getDate();
if (day.length === 1) day = '0' + day;
genDate = day + '-' + month + '-' + year;
*/
var genDate = '14-05-2015';
CLIENT_LANGS.forEach(function(cl) {
  var link = 'http://cdnbakmi.kaltura.com/content/clientlibs/' + cl + '_' + genDate + '.tar.gz';
  if (cl === 'node') cl = 'nodejs';
  CLIENT_LIB_MD += '<div class="client-lib-link ' + cl +  '"><a href="' + link + '">' +
                      '<img src="http://www.kaltura.com/api_v3/testme/images/buttons/' + cl + '.jpg">' +
                   '</a></div>';
});

var groups = module.exports = [{
  title: "Overview",
  contents: fs.readFileSync(__dirname + '/../markdown/overview.md', 'utf8'),
}, {
  title: "Client Libraries",
  contents: CLIENT_LIB_MD,
}, {
  title: " Generate API Sessions",
  children: [
    {tag: "session"},
    {tag: "appToken"},
    {operation: 'user.loginByLoginId'},
  ],
}, {
  title: " Ingest and Upload Media",
  children: [
    {tag: "uploadToken"},
    {tag: "media"},
    {tag: "captionAsset"},
    {tag: "captionParams"},
    {tag: "thumbAsset"},
    {tag: "attachmentAsset"},
    {tag: "externalMedia"},
    {tag: "upload", hidden: true},
  ],
}, {
  title: " Execute Bulk Ingest and Updates",
  children: [
    {operation: "media.bulkUploadAdd"},
    {operation: "user.addFromBulkUpload"},
    {operation: "category.addFromBulkUpload"},
    {operation: "cuePoint.addFromBulk"},
    {operation: "categoryEntry.addFromBulkUpload"},
    {operation: "categoryUser.addFromBulkUpload"},
    {tag: "bulk"},
    {tag: "schema"},
    {tag: "dropFolder"},
    {tag: "dropFolderFile"},
    {tag: "virusScanProfile", hidden: true},
    {tag: "aspera", hidden: true},
    {tag: "bulkUpload", hidden: true},
  ],
}, {
  title: " Convert and Transcode Media",
  children: [
    {tag: "flavorAsset"},
    {tag: "flavorParams"},
    {tag: "flavorParamsOutput"},
    {tag: "conversionProfile"},
    {tag: "conversionProfileAssetParams"},
    {tag: "mediaInfo"},
  ],
}, {
  title: " Live Stream and Broadcast",
  children: [
    {tag: "liveStream"},
  ],
}, {
  title: " Enrich and Organize Metadata",
  children: [
    {tag: "baseEntry"},
    {tag: "category"},
    {tag: "categoryEntry"},
    {tag: "categoryUser"},
    {tag: "metadata"},
    {tag: "metadataProfile"},
    {tag: "captionAsset"},
    {tag: "captionParams"},
    {tag: "captionAssetItem"},
    {tag: "attachmentAsset"},
    {tag: "thumbAsset"},
    {tag: "thumbParams"},
    {tag: "tag"},
  ],
}, {
  title: " Search, Discover and Personalize",
  children: [
    {operation: "baseEntry.list"},
    {tag: "captionAssetItem"},
    {tag: "playlist"},
    {tag: "like"},
    {tag: "shortLink"},
    {tag: "tag"},
    {tag: "user"},
    {tag: "groupUser"},
  ],
}, {
  title: " Engage and Publish",
  children: [
    {tag: "playlist"},
    {tag: "thumbnail"},
    {tag: "cuePoint"},
    {tag: "quiz"},
    {tag: "userEntry"},
    {tag: "like"},
    {tag: "uiConf"},
    {tag: "annotation", hidden: true},
  ],
}, {
  title: " Review Media Analytics",
  children: [
    {tag: "report"},
    {tag: "liveReports"},
    {tag: "liveStats"},
    {tag: "stats"},
  ],
}, {
  title: " Deliver and Distribute Media",
  children: [
    {tag: "playManifest"},
    {tag: "syndicationFeed"},
    {tag: "entryDistribution"},
    {tag: "distributionProfile"},
    {tag: "distributionProvider"},
    {tag: "deliveryProfile", hidden: true},
    {tag: "storageProfile", hidden: true},
  ],
}, {
  title: " Secure, Control and Govern",
  children: [
    {tag: "partner"},
    {tag: "user"},
    {tag: "userRole"},
    {tag: "groupUser"},
    {tag: "accessControlProfile"},
    {tag: "categoryEntry"},
    {tag: "categoryUser"},
    {tag: "permission"},
    {tag: "permissionItem"},
    {tag: "accessControl", hidden: true},
    {tag: "adminUser", hidden: true},
    {tag: "auditTrail", hidden: true},
  ],
}, {
  title: " Optimize API Requests",
  children: [
    {tag: "multirequest"},
    {tag: "responseProfile"},
  ],
}, {
  title: " Process and Integrate with Hooks",
  children: [
    {tag: "eventNotificationTemplate"},
    {tag: "scheduledTaskProfile"},
    {tag: "integration"},
    {tag: "businessProcessCase"},
    {tag: "notification", hidden: true},
  ],
}, {
  title: " Encrypt and License Content",
  children: [
    {tag: "drmLicenseAccess"},
    {tag: "drmPolicy"},
    {tag: "drmProfile"},
    {tag: "playReadyDrm"},
    {tag: "widevineDrm"},
    {tag: "deliveryProfile", hidden: true},
  ],
}, {
  title: " Manage Documents and Other Assets",
  children: [
    {tag: "baseEntry"},
    {tag: "data"},
    {tag: "documents"},
  ],
}, {
  title: " Manage and Deliver Apps and Widgets",
  children: [
    {tag: "uiConf"},
    {tag: "widget"},
    {tag: "fileAsset"},
    {tag: "captureSpace"},
  ],
}, {
  title: " Manage Backend and Storage",
  children: [
    {tag: "system"},
    {tag: "storageProfile", hidden: true},
  ],
}, {
  title: "Error Codes",
  contents: fs.readFileSync(__dirname + '/../markdown/errors.md', 'utf8')
}]
