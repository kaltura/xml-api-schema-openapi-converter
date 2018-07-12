let utils = module.exports = {};

utils.extractPropertiesAsMarkdown = (item) => {
  let props = [];
  const FIELDS = ['readOnly', 'insertOnly', 'writeOnly', 'abstract', 'optional', 'enableInMultiRequest'];
  FIELDS.forEach(f => {
    if (item.$[f] && item.$[f] !== '0') props.push(f);
  })
  return props.map(p => '`' + p + '`').join(' ');
}

utils.fixMarkdown = (str) => {
  if (!str) return;
  var ret = str.replace(/\n\s*\t\s*/g, '\n\n').trim();
  return ret || undefined;
}

utils.convertType = (type) => {
  if (type === "bool") return "boolean";
  if (type === "array") return "array";
  if (type === "int" || type === "bigint") return "integer";
  if (type === "float") return "number";
  if (type === "string") return "string";
  if (type === "map") return "object";
  if (type === "file") return "file";
  throw new Error("Unknown type:" + type);
}

utils.parseDefault = (def, type) => {
  if (!def || def === 'null') return;
  if (type === 'string') return def;
  if (type === 'integer') return parseInt(def);
  if (type === 'number') return parseFloat(def);
  if (type === 'boolean') return JSON.parse(def.toLowerCase());
  throw new Error("Unknown default type for " + def, type);
}

utils.getUniqueEnumOptions = enm => {
  var allVals = enm.oneOf.map(e => e.enum[0]);
  return enm.oneOf.filter((opt, idx) => {
    return idx === allVals.indexOf(opt.enum[0])
  })
}
