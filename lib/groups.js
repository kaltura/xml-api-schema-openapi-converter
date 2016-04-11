var fs = require('fs');


var groups = module.exports = [{
  title: "Overview",
  contents: fs.readFileSync(__dirname + '/../markdown/overview.md', 'utf8'),
}, {
  title: "Client Libraries",
  contents: require('../markdown/client_libraries.js'),
}, {
  title: "XML Schemas",
  children: require('../markdown/schemas.js'),
}, {
  title: "Generate API Sessions",
  children: [
    {tag: "session"},
    {tag: "appToken"},
    {operation: 'user.loginByLoginId'},
  ],
}, {
  title: "Ingest and Upload Media",
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
  title: "Execute Bulk Ingest and Updates",
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
  title: "Convert and Transcode Media",
  children: [
    {tag: "flavorAsset"},
    {tag: "flavorParams"},
    {tag: "flavorParamsOutput"},
    {tag: "conversionProfile"},
    {tag: "conversionProfileAssetParams"},
    {tag: "mediaInfo"},
  ],
}, {
  title: "Live Stream and Broadcast",
  children: [
    {tag: "liveStream"},
  ],
}, {
  title: "Enrich and Organize Metadata",
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
  title: "Search, Discover and Personalize",
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
  title: "Engage and Publish",
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
  title: "Review Media Analytics",
  children: [
    {tag: "report"},
    {tag: "liveReports"},
    {tag: "liveStats"},
    {tag: "stats"},
  ],
}, {
  title: "Deliver and Distribute Media",
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
  title: "Secure, Control and Govern",
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
  title: "Optimize API Requests",
  children: [
    {tag: "multirequest"},
    {tag: "responseProfile"},
  ],
}, {
  title: "Process and Integrate with Hooks",
  children: [
    {tag: "eventNotificationTemplate"},
    {tag: "scheduledTaskProfile"},
    {tag: "integration"},
    {tag: "businessProcessCase"},
    {tag: "notification", hidden: true},
  ],
}, {
  title: "Encrypt and License Content",
  children: [
    {tag: "drmLicenseAccess"},
    {tag: "drmPolicy"},
    {tag: "drmProfile"},
    {tag: "playReadyDrm"},
    {tag: "widevineDrm"},
    {tag: "deliveryProfile", hidden: true},
  ],
}, {
  title: "Manage Documents and Other Assets",
  children: [
    {tag: "baseEntry"},
    {tag: "data"},
    {tag: "documents"},
  ],
}, {
  title: "Manage and Deliver Apps and Widgets",
  children: [
    {tag: "uiConf"},
    {tag: "widget"},
    {tag: "fileAsset"},
    {tag: "captureSpace"},
  ],
}, {
  title: "Manage Backend and Storage",
  children: [
    {tag: "system"},
    {tag: "storageProfile", hidden: true},
  ],
}, {
  title: "Error Codes",
  contents: fs.readFileSync(__dirname + '/../markdown/errors.md', 'utf8')
}]
