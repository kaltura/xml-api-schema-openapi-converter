var groups = module.exports = [{
  label: " Generate API Sessions",
  items: [
    {tag: "session"},
    {tag: "appToken"},
  ],
}, {
  label: " Ingest and Upload Media",
  items: [
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
  label: " Execute Bulk Ingest and Updates",
  items: [
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
  label: " Convert and Transcode Media",
  items: [
    {tag: "flavorAsset"},
    {tag: "flavorParams"},
    {tag: "flavorParamsOutput"},
    {tag: "conversionProfile"},
    {tag: "conversionProfileAssetParams"},
    {tag: "mediaInfo"},
  ],
}, {
  label: " Live Stream and Broadcast",
  items: [
    {tag: "liveStream"},
  ],
}, {
  label: " Enrich and Organize Metadata",
  items: [
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
  label: " Search, Discover and Personalize",
  items: [
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
  label: " Engage and Publish",
  items: [
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
  label: " Review Media Analytics",
  items: [
    {tag: "report"},
    {tag: "liveReports"},
    {tag: "liveStats"},
    {tag: "stats"},
  ],
}, {
  label: " Deliver and Distribute Media",
  items: [
    {tag: "playManifest"},
    {tag: "syndicationFeed"},
    {tag: "entryDistribution"},
    {tag: "distributionProfile"},
    {tag: "distributionProvider"},
    {tag: "deliveryProfile", hidden: true},
    {tag: "storageProfile", hidden: true},
  ],
}, {
  label: " Secure, Control and Govern",
  items: [
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
  label: " Optimize API Requests",
  items: [
    {tag: "multirequest"},
    {tag: "responseProfile"},
  ],
}, {
  label: " Process and Integrate with Hooks",
  items: [
    {tag: "eventNotificationTemplate"},
    {tag: "scheduledTaskProfile"},
    {tag: "integration"},
    {tag: "businessProcessCase"},
    {tag: "notification", hidden: true},
  ],
}, {
  label: " Encrypt and License Content",
  items: [
    {tag: "drmLicenseAccess"},
    {tag: "drmPolicy"},
    {tag: "drmProfile"},
    {tag: "playReadyDrm"},
    {tag: "widevineDrm"},
    {tag: "deliveryProfile", hidden: true},
  ],
}, {
  label: " Manage Documents and Other Assets",
  items: [
    {tag: "baseEntry"},
    {tag: "data"},
    {tag: "documents"},
  ],
}, {
  label: " Manage and Deliver Apps and Widgets",
  items: [
    {tag: "uiConf"},
    {tag: "widget"},
    {tag: "fileAsset"},
    {tag: "captureSpace"},
  ],
}, {
  label: " Manage Backend and Storage",
  items: [
    {tag: "system"},
    {tag: "storageProfile", hidden: true},
  ],
}]
