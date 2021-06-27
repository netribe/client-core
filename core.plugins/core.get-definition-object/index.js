
/** 
 * @name core.getDefinitionObject
 * @function
 * @description Normalizes the arguments of an instanciating type into an object.
 * @param {string | object} name - the name of the instance or the entire instance definition object. 
 * @param {array | any} dependencies - array of string names of dependencies. 
 * if the third parameter ('get' function) is not supplied, this parameter will be the actual value of the module. 
 * @param {function} get - function to initialize the module when dependencies are met. 
 * @param {string} type - a string defining the type that is being instanciated. 
 * @param {function} done - a callback function for when this module has finished instanciation. 
 * @return {object} the instance definition object will have the fields { name, dependencies, get, $_type, done }. 
 * @example
 *   
 * 
 * 
 * */

function getDefinitionObject(name, dependencies, get, type, done) {
  if (!name) throw new Error(`${type} must have a name`);
  var definition;
  if (this.isObject(name)) {
    definition = name;
  } else {
    if (get) {
      definition = {
        name: name,
        dependencies: dependencies,
        get: get
      };
    } else {
      definition = {
        name: name,
        dependencies: [],
        value: dependencies,
      };
      
    }
  }
  definition.$_type = type || 'unknown';
  definition.done = definition.done || done;
  return definition;
}

module.exports = {
  name: 'core.getDefinitionObject',
  init(defintion, done) {
    this.extend({
      getDefinitionObject: getDefinitionObject
    });
    done(getDefinitionObject.bind(this));
  }
};