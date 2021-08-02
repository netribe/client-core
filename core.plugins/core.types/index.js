
import boolean from './types/boolean.js'
import number from './types/number.js'
import string from './types/string.js'
import array from './types/array.js'
import object from './types/object.js'
import func from './types/function.js'
import type from './types/type.js'
import schema from './types/schema.js'
import code from './types/code.js'
import keyValue from './types/keyValue.js'
import plugin from './types/plugin.js'

export default {
    name: 'core.types',
    dependencies: [
        'core.getDefinitionObject'
    ],
    init(definition, done){

        var core = this;

        var extend = {
            nativeTypes: {
                undefined(v){ return core.isUndefined(v); },
                null(v){ return core.isNull(v); },
                boolean(v){ return core.isBoolean(v); },
                string(v){ return core.isString(v); },
                number(v){ return core.isNumber(v); },
                array(v){ return core.isArray(v); },
                object(v){ return core.isObject(v); },
                function(v){ return core.isFunction(v); },
                any(v){ return true; }
            },
            types: {
                boolean,
                number,
                string,
                array,
                object,
                func,
                type,
                schema,
                code,
                keyValue,
                plugin,
            },
            Type(name, dependencies, get){
                var definition = this.getDefinitionObject(name, dependencies, get, 'type');    
                return this.build(definition);
            },
        };

        core.extend(extend);

        done(extend);

    }
};