'use strict';
// Import required modules
const _ = require('lodash');
const utils = require('./utils');

// Debugging operation setup
const DEBUG_OP = {service: '', action: ''};

// Maximum depth for query parameters
const MAX_QUERY_PARAM_DEPTH = 4;

// List of deprecated items
const DEPRECATED = [
  "document",
  "search",
  "mixing",
  "liveChannel",
  "liveChannelSegment",
];

// Base Swagger configuration
let BASE_SWAGGER = {
  swagger: '2.0',
  schemes: ['https'],
};

// Target API, default is 'ovp'
const TARGET_API = process.env.TARGET_API || 'ovp';
// Use POST operations flag, default is true
const USE_POST_OPERATIONS = process.env.USE_POST_OPERATIONS !== 'false';

/**
* SwaggerBuilder Class
* Constructs a SwaggerBuilder instance with predefined swagger, security, and parameters.
*/
class SwaggerBuilder {
  /**
  * Constructor for the SwaggerBuilder class.
  */
  constructor() {
    // Update BASE_SWAGGER based on TARGET_API
    if (TARGET_API === 'ott') {
      BASE_SWAGGER = {
        ...BASE_SWAGGER,
        host: 'tvpapi-us-preprod.ott.kaltura.com',
        basePath: '/api_v3',
        info: {title: "Kaltura OTT", description: "The Kaltura OTT API"},
        produces: ['application/json', 'text/xml'],
      };
    } else {
      BASE_SWAGGER = {
        ...BASE_SWAGGER,
        host: 'cdnapi-ev.kaltura.com',
        basePath: '/api_v3',
        info: {
          title: "Kaltura Video Experience Cloud API",
          description: "Kaltura Media Services offers a feature-rich API for seamless integration of high-quality video streaming and management. It provides scalability, flexibility, and extensive customization options, empowering developers to build robust media-centric applications."
        },
        produces: ['application/json', 'text/xml'],
      };
    }
    
    // Create a copy of the BASE_SWAGGER object
    this.swagger = {...BASE_SWAGGER};
    
    // Initialize security
    this.swagger.security = [{ks: []}];
    
    // Set security definitions based on TARGET_API
    if (TARGET_API === 'ovp') {
      this.swagger.securityDefinitions = {
        "ks": {
          in: 'query',
          name: 'ks',
          type: 'apiKey',
          description: 'The Kaltura Session to authenticate the user, widget or appToken with',
        }
      };
    } else {
      this.swagger.securityDefinitions = {
        "ks": {
          in: 'body',
          name: 'ks',
          type: 'apiKey',
          description: 'A Kaltura session ID',
        }
      };
    }
    
    // Set parameters
    this.swagger.parameters = {
      ks: {
        name: 'ks',
        in: 'query',
        type: 'string',
        'x-global': true,
      },
      format: {
        name: 'format',
        enum: [1, 2, 3],
        'x-enumLabels': ['JSON', 'XML', 'PHP'],
        'x-consoleDefault': 1,
        description: 'The API response format',
        in: 'query',
        type: 'integer',
        'x-global': true,
      },
      clientTag: {
        name: 'clientTag',
        type: 'string',
        in: 'query',
        default: 'devkcom',
        description: 'Use to tag the app or client-lib making calls to Kaltura API',
        //'x-hidden':  true,
      }
    };
  }
  
  /**
  * Retrieves the class name from a given reference string. 
  * The reference string is expected to have 'definitions/' as a prefix followed by the class name.
  * 
  * @param {string} ref - The reference string from which the class name is to be extracted.
  * @returns {string} The class name extracted from the reference string.
  */
  getClassnameFromRef(ref) {
    return ref.match(/definitions\/(.*)$/)[1];
  }
  
  /**
  * Creates a reference string for a given class name. 
  * The class name is prefixed with 'definitions/' to form the reference string.
  * 
  * @param {string} className - The class name for which the reference string is to be formed.
  * @returns {string} The formed reference string for the given class name.
  */
  getRefFromClassname(className) {
    return `#/definitions/${className}`;
  }
  
  /**
  * Run the SwaggerBuilder setup
  * @param {Object} kaltura - The Kaltura configuration object
  * @returns {Object} The built swagger object
  */
  run(kaltura) {
    // Initialize services, enums, classes from kaltura
    this.services = kaltura.services[0].service;
    this.enums = kaltura.enums[0].enum;
    this.classes = kaltura.classes[0].class;
    
    // Set the swagger version
    this.swagger.info.version = kaltura.$.apiVersion;
    
    // Define global parameters
    this.globalParams = [{$ref: '#/parameters/format'}, {$ref: '#/parameters/clientTag'}];
    
    // Run the helper methods. Please note that these methods need to be defined in the class
    this.addRequestConfiguration(kaltura.configurations[0].request[0]);
    this.addEnums();
    this.addDefinitions();
    this.addPaths(kaltura.errors[0].error);
    this.setTags();
    this.addErrors(kaltura.errors[0].error);
    this.finish();
    
    // Return the constructed swagger object
    return this.swagger;
  }
  
  /**
  * Get class by className
  * @param {string} className - The name of the class
  * @returns {Object} The class object
  */
  getClass(className) {
    if (className === 'KalturaObjectBase') return {$: {}};
    if (className.indexOf('#') === 0) className = this.getClassnameFromRef(className);
    return this.classes.find(c => c.$.name === className);
  }
  
  /**
  * Get subclasses of a class by className
  * @param {string} className - The name of the class
  * @returns {Array} The array of subclasses' names
  */
  getSubclasses(className) {
    let subs = this.classes.filter(cls => cls.$.base === className).map(cls => cls.$.name);
    
    const addIndirectSubs = (s) => {
      const newSubs = this.getSubclasses(s).filter(name => !subs.includes(name));
      subs = [...subs, ...newSubs];
      newSubs.forEach(addIndirectSubs);
    }
    subs.forEach(addIndirectSubs);
    
    return subs;
  }
  
  /**
  * Get superclasses of a class by name
  * @param {string} name - The name of the class
  * @returns {Array} The array of superclasses' names
  */
  getSuperclasses(name) {
    const cls = this.getClass(name);
    let supers = cls.$.base ? [cls.$.base] : [];
    let superSupers = [];
    
    supers.forEach(s => {
      const newSupers = this.getSuperclasses(s).filter(n => !superSupers.includes(n));
      superSupers = [...superSupers, ...newSupers];
    });
    
    return [...superSupers, ...supers];
  }
  
  /**
  * Finalize the swagger configuration
  */
  finish() {
    // These methods need to be defined in the class
    this.setInputOptions();
    this.fixDefinitions();
    this.fixFileOperations();
  }
  
  /**
  * Set the tags for the Swagger API documentation
  */
  setTags() {
    this.swagger.tags = this.services
    .map(s => ({
      name: s.$.name,
      description: utils.fixMarkdown(s.$.description),
      ...(s.$.plugin && { 'x-plugin': s.$.plugin }),
    }))
    .sort((t1, t2) => t1.name.toLowerCase().localeCompare(t2.name.toLowerCase()));
  }
  
  /**
  * Add request configuration to the Swagger API documentation
  * @param {Object} config - The configuration object
  */
  addRequestConfiguration(config) {
    for (let key in config) {
      if (key === '$' || key in this.swagger.parameters) continue;
      
      let kparam = config[key][0];
      let param = this.swagger.parameters[key] = {
        name: key,
        in: kparam.$.type.startsWith('Kaltura') ? 'body' : 'query',
        'x-global': true,
        'x-volatile': kparam.$.volatile === '1',
      }
      
      if (param.in === 'body') {
        param.schema = {
          type: 'object',
          properties: {
            [key]: {$ref: '#/definitions/' + kparam.$.type}
          }
        }
      } else {
        param.type = utils.convertType(kparam.$.type);
      }
      
      this.globalParams.push({$ref: '#/parameters/' + key});
    }
  }
  
  /**
  * Add enumerations to the Swagger API documentation
  */
  addEnums() {
    this.swagger['x-enums'] = {};
    
    this.enums.forEach(enm => {
      const values = (enm.const || []).map(c => {
        let value = enm.$.enumType === 'int' ? parseInt(c.$.value, 10) : c.$.value;
        return {value, name: c.$.name};
      });
      
      this.swagger['x-enums'][enm.$.name] = {
        title: enm.$.name,
        oneOf: values.map(v => ({
          title: v.name,
          enum: [v.value],
        })),
      };
    });
  }
  
  /**
  * Get all base classes of a given definition
  * @param {string} def - The definition of the class
  * @returns {Array} The array of all base class names
  */
  getAllBases(def) {
    let bases = this.classes.filter(sub => sub.$.base === def);
    let transitive = bases.reduce((cur, next) => {
      return cur.concat(this.getAllBases(next.$.name));
    }, []);
    return bases.filter(b => b.$.abstract !== "1").map(b => b.$.name).concat(transitive);
  }
  
  /**
  * Add definitions to the Swagger object
  */
  addDefinitions() {
    this.swagger.definitions = { KalturaObjectBase: {} };
    if (TARGET_API === 'ott') {
      this.swagger.definitions.OTTRequest = {
        type: 'object',
        properties: {
          ks: { type: 'string' },
          apiVersion: {
            type: 'string',
            default: this.swagger.info.version,
          },
        }
      }
    }
    
    this.classes.forEach((cls) => {
      let def = this.swagger.definitions[cls.$.name] = {
        title: cls.$.name,
        type: 'object',
        properties: {},
      };
      
      if (cls.$.base) {
        def.allOf = [{ $ref: this.getRefFromClassname(cls.$.base) }];
      }
      
      let subs = this.getAllBases(cls.$.name);
      if (subs.length) {
        def['x-abstract'] = cls.$.abstract && cls.$.abstract !== "0"
        def.anyOf = subs.map(s => ({ $ref: this.getRefFromClassname(s) }));
        let enumVals = subs.map(s => s);
        if (!def['x-abstract']) {
          def.anyOf.unshift({ $ref: this.getRefFromClassname(cls.$.name) });
          enumVals.unshift(cls.$.name);
        }
        def.discriminator = 'objectType';
        def.properties.objectType = { type: 'string', enum: enumVals };
      }
      
      let descriptionParts = [
        utils.extractPropertiesAsMarkdown(cls),
        utils.fixMarkdown(cls.$.description),
      ];
      def.description = descriptionParts.filter(p => p).join('\n\n') || undefined;
      
      /**
      * If the class name ends with 'Filter', it replaces 'Filter' with 'OrderBy'
      * and adds the corresponding enumeration to the Swagger definition.
      */
      if (cls.$.name.match(/Filter$/i)) {
        const enumName = cls.$.name.replace('Filter', 'OrderBy');
        const enm = this.swagger['x-enums'][enumName];
        
        // If an enumeration matching the enumName exists, it is added to the Swagger properties
        if (enm) {
          // Initialize swagger property for 'orderBy'
          let swaggerProp = def.properties.orderBy = { type: 'string' };
          
          // Map the enumeration values
          swaggerProp.enum = enm.oneOf.map(v => v.enum[0]);
          
          // If no enumeration values exist, delete the 'enum' property
          if (!swaggerProp.enum.length) delete swaggerProp.enum;
          
          // Map the enumeration labels
          swaggerProp['x-enumLabels'] = enm.oneOf.map(v => v.title);
          
          // Set the 'x-enumType' to enumName
          swaggerProp['x-enumType'] = enumName;
        }
      }
      
      var props = cls.property || [];
      props.forEach((prop) => {
        var swaggerProp = def.properties[prop.$.name] = {};
        if (prop.$.type.indexOf('Kaltura') === 0) {
          swaggerProp.$ref = this.getRefFromClassname(prop.$.type);
          return;
        } else if (prop.$.arrayType && prop.$.arrayType.indexOf('Kaltura') === 0) {
          swaggerProp.type = 'array';
          swaggerProp.items = { $ref: this.getRefFromClassname(prop.$.arrayType) };
          return;
        }
        if (prop.$.readOnly && prop.$.readOnly !== '0') {
          swaggerProp.readOnly = true;
        }
        
        let descriptionParts = [
          utils.extractPropertiesAsMarkdown(prop),
        ];
        swaggerProp.type = utils.convertType(prop.$.type);
        
        if (prop.$.enumType) {
          descriptionParts.push('Enum Type: `' + prop.$.enumType + '`');
          var enm = this.swagger['x-enums'][prop.$.enumType];
          let enumOptions = utils.getUniqueEnumOptions(enm);
          swaggerProp.enum = enumOptions.map((opt) => {
            return swaggerProp.type === 'integer' ? parseInt(opt.enum[0]) : opt.enum[0];
          });
          if (!swaggerProp.enum.length) delete swaggerProp.enum;
          swaggerProp['x-enumType'] = prop.$.enumType;
          if (prop.$.enumType !== 'KalturaLanguage') {
            swaggerProp['x-enumLabels'] = enumOptions.map((opt) => {
              return opt.title;
            })
          }
        }
        descriptionParts.push(utils.fixMarkdown(prop.$.description))
        let desc = descriptionParts.filter(p => p).join('\n\n');
        if (desc) swaggerProp.description = desc;
      })
    });
  }
  
  /**
  * This method initializes an operation.
  * @param {Object} op - The operation object to be initialized.
  * @param {Object} service - The service related to the operation.
  * @param {Object} action - The action related to the operation.
  */
  initializeOperation(op, service, action) {
    op.description = utils.fixMarkdown(action.$.description);
    op.tags = [service.$.name];
    op.operationId = `${service.$.name}.${action.$.name}`;
    if (action.$.deprecated) {
      op.deprecated = true;
    }
    if (action.$.beta) {
      op['x-beta'] = true;
    }
  }
  
  /**
  * This method creates a GET operation.
  * @param {Object} service - The service for the operation.
  * @param {Object} action - The action for the operation.
  * @param {Object} path - The path for the operation.
  * @param {Object} expandedParams - The expanded parameters for the operation.
  */
  createGetOperation(service, action, path, expandedParams) {
    const log = DEBUG_OP.service === service.$.id && DEBUG_OP.action == action.$.name;
    let op = path.get = {};
    op['x-kaltura-format'] = 'get';
    op['x-kaltura-parameters'] = [];
    this.initializeOperation(op, service, action);
    op.parameters = [{
      $ref: '#/parameters/format',
    }];
    if (action.$.sessionRequired === 'none') {
      op.security = [];
    } else {
      op.parameters.unshift({
        $ref: '#/parameters/ks',
      });
    }
    var parameters = action.param || [];
    parameters.forEach((param) => {
      op['x-kaltura-parameters'].push(param.$.name);
      if (param.$.type.indexOf('Kaltura') === 0) {
        let exParams = expandedParams[param.$.type];
        if (!exParams) {
          exParams = expandedParams[param.$.type] = this.getExpandedQueryParameters(param.$.type);
        }
        // Define a constant for the group regex
        const GROUP_REGEX = /(.*)\[[^\]]+\]$/;
        
        // Initialize 'x-parameterGroups' if not already done
        op['x-parameterGroups'] = op['x-parameterGroups'] || [];
        
        // Function to get a group by name from the list of groups
        const getGroup = (name, groups = op['x-parameterGroups']) => {
          const group = groups.find(g => g.name === name);
          
          if (group) return group;
          
          return groups
          .filter(g => g.subGroups)
          .flatMap(g => getGroup(name, g.subGroups))
          .find(g => g);
        }
        
        // Function to add a new group
        const addGroup = (name) => {
          // If group already exists, no need to add it
          if (getGroup(name)) return;
          
          const parentGroupName = name.match(GROUP_REGEX)[1];
          const parentGroup = getGroup(parentGroupName);
          
          parentGroup.subGroups = parentGroup.subGroups || [];
          parentGroup.subGroups.push({ name });
        }
        
        // Add a new parameter group to 'x-parameterGroups'
        op['x-parameterGroups'].push({
          name: param.$.name,
          description: `Object Type: \`${param.$.type}\``,
          schema: { $ref: this.getRefFromClassname(param.$.type) },
          subGroups: [],
        });
        
        // Initialize 'parameters' in swagger if not already done
        this.swagger.parameters = this.swagger.parameters || {};
        
        exParams.forEach(exParam => {
          exParam = { ...exParam };
          exParam.name = `${param.$.name}${exParam.name}`;
          
          const groupName = exParam.name.match(GROUP_REGEX)[1];
          
          exParam['x-group'] = groupName;
          
          addGroup(groupName);
          
          if (exParam['x-showCondition']) {
            exParam['x-showCondition'].name = `${param.$.name}${exParam['x-showCondition'].name}`;
          }
          
          const refKey = `${param.$.type}:${exParam.name}`;
          
          this.swagger.parameters[refKey] = exParam;
          op.parameters.push({ $ref: `#/parameters/${refKey}` });
        });
        
        if (log) console.log('exparam', exParams);
        
        return;
        
      } else if (param.$.type === "array") {
        return;
      }
      // Start by declaring and populating a new parameter object
      let newParam = {
        name: param.$.name,
        in: 'query',
        description: utils.fixMarkdown(param.$.description),
        type: utils.convertType(param.$.type),
        // Check if the parameter is optional and set 'required' accordingly
        required: param.$.optional !== "1",
      };
      
      // Parse and set the default value if it exists
      let def = utils.parseDefault(param.$.default, newParam.type);
      if (def !== undefined) {
        newParam.default = def;
      }
      
      // Check if there is an enum type for this parameter in the swagger document
      let enm = this.swagger['x-enums'][param.$.enumType];
      if (enm) {
        // Add a message about the enum type to the parameter description
        let msg = `Enum Type: \`${param.$.enumType}\``;
        newParam.description = `${msg}${newParam.description ? '\n\n' + newParam.description : ''}`;
        
        // Get the unique options for this enum
        let enumOptions = utils.getUniqueEnumOptions(enm);
        
        // Set the enum values and labels
        newParam.enum = enumOptions.map(e => e.enum[0]);
        if (!newParam.enum.length) {
          delete newParam.enum;
        }
        newParam['x-enumLabels'] = enumOptions.map(e => e.title);
        newParam['x-enumType'] = enm.title;
      }
      
      // If in debug mode, log the new parameter
      if (log) {
        console.log('param', newParam);
      }
      
      // Finally, add the new parameter to the operation
      op.parameters.push(newParam);
      
    });
    return op;
  }
  
  /**
  * Creates a POST operation for a given service and action
  * @param {Object} service - The service object
  * @param {Object} action - The action object
  * @param {Object} path - The path object
  * @returns {Object} The operation object
  */
  createPostOperation(service, action, path) {
    const log = false;
    let op = path.post = {};
    op['x-kaltura-format'] = 'post';
    this.initializeOperation(op, service, action);
    let bodyParam = {
      name: 'body',
      in: 'body',
      schema: {
        type: 'object',
        properties: {}
      }
    };
    op.parameters = this.globalParams.concat([bodyParam]);
    if (TARGET_API === 'ott') {
      bodyParam.schema.allOf = [{$ref: '#/definitions/OTTRequest'}];
    } else {
      if (action.$.sessionRequired === 'none') {
        op.security = [];
      } else {
        op.parameters.unshift({
          $ref: '#/parameters/ks',
        })
      }
    }
    if (!action.param || !action.param.length) {
      op.parameters = op.parameters.filter(p => p !== bodyParam);
    }
    op['x-kaltura-parameters'] = (action.param || []).map(p => p.$.name);
    let requiredParams = (action.param || []).filter(p => p.$.optional !== "1").map(p => p.$.name);
    if (requiredParams.length) bodyParam.schema.required = requiredParams;
    (action.param || []).forEach(param => {
      let pSchema = bodyParam.schema.properties[param.$.name] = {};
      if (param.$.type.indexOf('Kaltura') === 0) {
        pSchema.$ref = this.getRefFromClassname(param.$.type);
      } else {
        pSchema.type = utils.convertType(param.$.type);
        if (pSchema.type === 'array') {
          pSchema.items = {$ref: this.getRefFromClassname(param.$.arrayType)};
        }
        let dft = utils.parseDefault(param.$.default, pSchema.type);
        if (dft !== undefined) pSchema.default = dft;
        let enm = this.swagger['x-enums'][param.$.enumType];
        if (enm) {
          let enumOptions = utils.getUniqueEnumOptions(enm);
          pSchema.enum = enumOptions.map(e => e.enum[0]);
          pSchema['x-enumLabels'] = enumOptions.map(e => e.title);
          pSchema['x-enumType'] = param.$.enumType;
        }
      }
    });
    return op;
  }
  
  /**
  * Sets the operation's security and body schema based on the target API and action properties
  * @param {Object} bodyParam - The body parameter of the operation
  * @param {Object} action - The action to be taken in the operation
  * @param {Object} op - The operation object
  */
  setOperationSecurity(bodyParam, action, op) {
    if (TARGET_API === 'ott') {
      bodyParam.schema.allOf = [{$ref: '#/definitions/OTTRequest'}];
    } else {
      if (action.$.sessionRequired === 'none') {
        op.security = [];
      } else {
        op.parameters.unshift({
          $ref: '#/parameters/ks',
        })
      }
    }
  }
  
  /**
  * Sets the schema properties for the operation
  * @param {Object} bodyParam - The body parameter of the operation
  * @param {Object} action - The action to be taken in the operation
  */
  setSchemaProperties(bodyParam, action) {
    let requiredParams = (action.param || []).filter(p => p.$.optional !== "1").map(p => p.$.name);
    if (requiredParams.length) bodyParam.schema.required = requiredParams;
    
    (action.param || []).forEach(param => {
      let pSchema = bodyParam.schema.properties[param.$.name] = {};
      if (param.$.type.indexOf('Kaltura') === 0) {
        pSchema.$ref = this.getRefFromClassname(param.$.type);
      } else {
        this.setNonKalturaSchemaProperties(pSchema, param);
      }
    });
  }
  
  /**
  * Sets the schema properties for non-Kaltura types
  * @param {Object} pSchema - The schema object to be modified
  * @param {Object} param - The parameter object
  */
  setNonKalturaSchemaProperties(pSchema, param) {
    pSchema.type = utils.convertType(param.$.type);
    if (pSchema.type === 'array') {
      pSchema.items = {$ref: this.getRefFromClassname(param.$.arrayType)};
    }
    let dft = utils.parseDefault(param.$.default, pSchema.type);
    if (dft !== undefined) pSchema.default = dft;
    
    let enm = this.swagger['x-enums'][param.$.enumType];
    if (enm) {
      let enumOptions = utils.getUniqueEnumOptions(enm);
      pSchema.enum = enumOptions.map(e => e.enum[0]);
      pSchema['x-enumLabels'] = enumOptions.map(e => e.title);
      pSchema['x-enumType'] = param.$.enumType;
    }
  }
  
  /**
  * Adds paths to the swagger object
  * @param {Array} errors - Array of possible errors
  */
  addPaths(errors) {
    this.swagger.paths = {};
    let expandedParams = {}
    
    const getResponseSchema = (type, arrayType) => {
      if (type.indexOf('Kaltura') === 0) {
        return {'$ref': this.getRefFromClassname(type)};
      } else {
        let schema = {type: utils.convertType(type)};
        if (schema.type === 'file') schema.type = 'string'
        if (schema.type === 'array') {
          schema.items = getResponseSchema(arrayType);
        }
        return schema;
      }
    }
    
    this.services.forEach((service) => {
      if (DEPRECATED.indexOf(service.$.name) !== -1) return;
      var actions = service.action;
      actions.forEach((action) => {
        var pathname = '/service/' + service.$.id + '/action/' + action.$.name;
        console.log(pathname);
        var path = this.swagger.paths[pathname] = {};
        var log = DEBUG_OP.service === service.$.id && DEBUG_OP.action == action.$.name;
        let hasFileParam = !!(action.param || []).filter(p => p.$.type === 'file').length
        let op = USE_POST_OPERATIONS && !hasFileParam?
        this.createPostOperation(service, action, path)
        : this.createGetOperation(service, action, path, expandedParams);
        
        op.responses = {
          '200': {
            description: 'Success',
          }
        }
        
        var result = action.result[0];
        if (result) {
          op.responses['200'].schema = getResponseSchema(result.$.type, result.$.arrayType);
        }
        
        if (action.throws) {
          let errResp = op.responses['x-Errors'] = {description: ""};
          action.throws.filter(t => t.$).forEach(t => {
            let errName = t.$.name;
            if (errResp.description) errResp.description += '\n';
            errResp.description += '* `' + errName + '`';
            let details = errors.filter(e => e.$.name === errName)[0];
            let message = details && (details.$.message || details.$.description);
            if (message) errResp.description += ': ' + message;
          })
        }
      });
    });
  }
  
  /**
  * Returns expanded query parameters for a given definition name
  * @param {string} definitionName - Name of the definition
  * @returns {Array} params - Array of parameters
  */
  getExpandedQueryParameters(definitionName) {
    let params = [];
    
    const addParams = (defName, baseName = '', cond, skipSuper, skipSub) => {
      if (baseName.split(/\[/).length > MAX_QUERY_PARAM_DEPTH) return;
      
      let def = this.swagger.definitions[defName];
      if (!def) throw new Error(`Definition ${defName} not found`);
      
      if (!skipSuper) {
        let superclasses = this.getSuperclasses(defName);
        superclasses.forEach((sc) => {
          addParams(sc, baseName, cond, true, true);
        });
      }
      
      let props = def.properties;
      for (let prop in props) {
        let propDef = props[prop];
        if (propDef.readOnly) continue;
        if (propDef.$ref) {
          let subDef = this.getClassnameFromRef(propDef.$ref);
          addParams(subDef, `${baseName}[${prop}]`, cond, false, false);
          continue;
        }
        let items = undefined;
        if (propDef.items) {
          items = {anyOf: [propDef.items], type: 'object'};
          if (propDef.items.$ref) {
            let subDef = this.getClassnameFromRef(propDef.items.$ref);
            items.anyOf = items.anyOf.concat(this.getSubclasses(subDef).map(c => ({$ref: this.getRefFromClassname(c)})));
          }
        }
        let newParam = {
          type: propDef.type,
          items: items,
          in: 'query',
          name: `${baseName}[${prop}]`,
          enum: propDef.enum,
          'x-enumLabels': propDef['x-enumLabels'],
          'x-enumType': propDef['x-enumType'],
          description: propDef.description,
        };
        if (!newParam.enum && prop === 'orderBy') {
          let enumName = definitionName.replace('Filter', 'OrderBy');
          let enm = this.swagger['x-enums'][enumName];
          if (enm) {
            newParam.enum = enm.oneOf.map(v => v.enum[0]);
            if (!newParam.enum.length) delete newParam.enum;
            newParam['x-enumLabels'] = enm.oneOf.map(v => v.title);
            newParam['x-enumType'] = enumName;
          }
        }
        let oldParam = params.filter(p => p.name === newParam.name)[0];
        if (oldParam) {
          if (oldParam['x-showCondition']) {
            oldParam['x-showCondition'].value = oldParam['x-showCondition'].value.concat(cond.value);
            oldParam['x-showCondition'].value = [...new Set(oldParam['x-showCondition'].value)];
          }
        } else {
          if (cond) newParam['x-showCondition'] = cond;
          params.push(newParam);
        }
      }
      
      if (!skipSub) {
        let subclasses = this.getSubclasses(defName);
        if (subclasses.length) {
          let paramName = `${baseName}[objectType]`;
          let existing = params.filter(p => p.name === paramName)[0];
          if (!existing) {
            params.push({
              name: paramName,
              in: 'query',
              enum: subclasses,
              type: 'string',
            });
          } else {
            subclasses = subclasses.filter(s => existing.enum.indexOf(s) === -1);
            existing.enum = [...new Set(existing.enum.concat(subclasses))];
          }
          subclasses.forEach((subName) => {
            addParams(subName, baseName, {name: paramName, value: [subName]}, false, false);
          });
        }
      }
    }
    
    addParams(definitionName);
    return params;
  }
  
  /**
  * Fixes definitions in the swagger schema
  */
  fixDefinitions() {
    for (let def in this.swagger.definitions) {
      this.fixSchema(this.swagger.definitions[def]);
    }
  }
  
  /**
  * Fixes a given schema
  * @param {object} schema - The schema to be fixed
  */
  fixSchema(schema) {
    if (schema.type === 'file') schema.type = 'string';
    if (schema.items) this.fixSchema(schema.items);
    if (schema.properties) {
      for (let key in schema.properties) {
        this.fixSchema(schema.properties[key]);
      }
    }
  }
  
  /**
  * Fixes file operations in the swagger paths
  */
  fixFileOperations() {
    for (let path in this.swagger.paths) {
      let op = this.swagger.paths[path].get;
      if (!op) continue;
      let fileParams = op.parameters.map(p => {
        if (!p.$ref) return p;
        let ref = p.$ref.match(/#\/parameters\/(.*)$/)[1];
        return this.swagger.parameters[ref];
      }).filter(p => p.type === 'file');
      if (!fileParams.length) continue;
      op['x-kaltura-format'] = 'file';
      fileParams.forEach(p => p.in = 'formData');
      this.swagger.paths[path].post = op;
      delete this.swagger.paths[path].get;
    }
  }
  
  /**
  * Set input options for the Swagger definition.
  */
  setInputOptions() {
    /**
    * Add a dynamic enum type for the specified parameter.
    * @param {Object} p - The parameter.
    * @param {string} name - The name.
    */
    const addDynEnum = (p, name) => {
      const path = `/service/${name}/action/list`;
      
      if (!this.swagger.paths[path]) return;
      
      const label = name === 'media' ? 'name' : 'id';
      
      p['x-inputType'] = ['number', 'integer'].includes(p.type) ? 'number' : 'text';
      
      p['x-dynamicEnum'] = {
        path: `/service/${name}/action/list`,
        method: USE_POST_OPERATIONS ? 'post' : 'get',
        array: 'objects',
        label,
        value: 'id',
      }
    }
    
    /**
    * Adjust the parameters of the schema based on their type.
    * @param {Object} p - The parameter.
    * @param {Object} schema - The schema.
    * @param {string} path - The path.
    */
    const adjustParameter = (p, schema, path) => {
      if (p.$ref) return;
      
      const isGet = path && path.endsWith('/get');
      
      if (['password', 'secret'].includes(p.name)) p['x-inputType'] = 'password';
      
      if (/Date\]?$/.test(p.name)) p['x-inputType'] = 'datetime';
      
      if (p.name === 'entryId' && isGet && path.startsWith('/service/media/')) {
        addDynEnum(p, 'media', {properties: {name: {type: 'string'}}});
        p['x-inputType'] = ['number', 'integer'].includes(p.type) ? 'number' : 'text';
      }
      
      if (path === '/service/session/action/start' && p.name === 'expiry') {
        p.default = 86400;
      }
    }
    
    /**
    * Recursively adjust the properties in the schema.
    * @param {Object} schema - The schema.
    * @param {string} path - The path.
    */
    const adjustSchema = (schema, path = '') => {
      const isGet = path.endsWith('/get');
      
      for (let prop in schema.properties || {}) {
        if (isGet && path.startsWith('/service/media/') && prop === 'entryId') {
          addDynEnum(schema.properties[prop], 'media');
        }
        
        if (['password', 'secret'].includes(prop)) {
          schema.properties[prop]['x-inputType'] = 'password';
        } else if (/Date$/.test(prop)) {
          schema.properties[prop]['x-inputType'] = 'datetime';
        } else if (prop === 'expiry' && path === '/service/session/action/start') {
          schema.properties[prop].default = 86400;
        }
        
        adjustSchema(schema.properties[prop]);
      }
      
      if (schema.items) adjustSchema(schema.items);
    }
    
    for (let path in this.swagger.paths) {
      const op = this.swagger.paths[path].get || this.swagger.paths[path].post;
      let schema = op.responses['200'].schema;
      
      if (schema) schema = this.resolveRef(schema);
      
      (op.parameters || []).forEach(p => adjustParameter(p, schema, path));
      
      const bodyParam = op.parameters.find(p => p.in === 'body');
      
      if (bodyParam && bodyParam.schema) {
        adjustSchema(bodyParam.schema, path);
      }
    }
    
    for (let key in this.swagger.definitions) {
      adjustSchema(this.swagger.definitions[key]);
    }
    
    Object.values(this.swagger.parameters || {}).forEach(p => adjustParameter(p));
  }
  
  /**
  * Adds errors to the swagger definition
  * @param {Array} errors - Array of error objects
  */
  addErrors(errors) {
    this.swagger['x-errors'] = errors.map(err => err.$);
  }
  
  /**
  * Resolves references within the schema
  * @param {Object} schema - A schema object
  * @returns {Object} - The resolved schema or the original schema if no reference is found
  */
  resolveRef(schema) {
    const ref = schema.$ref;
    if (!ref) return schema;
    return this.swagger.definitions[this.getClassnameFromRef(ref)];
  }
}

// Export the SwaggerBuilder class
module.exports = SwaggerBuilder;