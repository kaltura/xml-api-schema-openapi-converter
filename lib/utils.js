let utils = module.exports = {};

/**
 * Extracts certain properties from an object and returns them as a Markdown string.
 *
 * @param {Object} item - The object to extract properties from.
 * @returns {string} A Markdown string with the properties' names.
 */
utils.extractPropertiesAsMarkdown = (item) => {
  let props = [];
  const FIELDS = ['readOnly', 'insertOnly', 'writeOnly', 'abstract', 'optional', 'enableInMultiRequest'];
  FIELDS.forEach(f => {
    if (item.$[f] && item.$[f] !== '0') props.push(f);
  })
  return props.map(p => '`' + p + '`').join(' ');
}

/**
 * Fixes the formatting of a Markdown string.
 *
 * @param {string} str - The Markdown string to fix.
 * @returns {string|undefined} The fixed Markdown string, or undefined if the input was empty or undefined.
 */
utils.fixMarkdown = (str) => {
  if (!str) return;
  var ret = str.replace(/\n\s*\t\s*/g, '\n\n').trim();
  return ret || undefined;
}

const typeMappings = {
  "bool": "boolean",
  "array": "array",
  "int": "integer",
  "bigint": "integer",
  "float": "number",
  "string": "string",
  "map": "object",
  "file": "file"
};

/**
 * Converts a type name from one naming convention to another.
 *
 * @param {string} type - The type name to convert.
 * @returns {string} The converted type name.
 * @see typeMappings
 * @throws Will throw an error if the input type is unknown.
 */
utils.convertType = (type) => {
  const result = typeMappings[type];
  if (result !== undefined) {
    return result;
  }
  throw new Error("Unknown type:" + type);
}

const defaultParsers = {
  'string': def => def,
  'integer': def => parseInt(def),
  'number': def => parseFloat(def),
  'boolean': def => JSON.parse(def.toLowerCase())
};
/**
 * Parses a default value to the corresponding type.
 *
 * @param {*} def - The default value.
 * @param {string} type - The type of the default value.
 * @see defaultParsers
 * @returns {*} The parsed default value.
 * @throws Will throw an error if the input type is unknown.
 */
utils.parseDefault = (def, type) => {
  if (!def || def === 'null') return;
  const parser = defaultParsers[type];
  if (parser !== undefined) {
    return parser(def);
  }
  throw new Error("Unknown default type for " + def, type);
}

/**
 * Gets unique options from an enumeration object.
 *
 * @param {Object} enm - The enumeration object.
 * @returns {Object[]} An array of unique options from the enumeration object.
 */
utils.getUniqueEnumOptions = enm => {
  var allVals = new Set(enm.oneOf.map(e => e.enum[0]));
  return Array.from(allVals).map(val => {
    return enm.oneOf.find(opt => opt.enum[0] === val);
  });
}
