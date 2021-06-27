
## core.getDefinitionObject

Extends `core` with a function called `getDefinitionObject`:

`core.getDefinitionObject()` normalizes the arguments of an instanciating type into an object.
this is to allow type constructors to take a list arguments instead of on keyed object. core.getDefinitionObject() will normalize the list of arguments into an object.


```js
core.plugin(
    require('core.plugin.core.get_definition_object')
);

// pass in a number of arguments in order:
var definitionObject = core.getDefinitionObject(
    'SomeModule',          // the name of the module
    ['SomeDependency'],    // dependencies
    (SomeDependency) => {  // get function, will be called when all dependencies have loaded, expected to return the module.

        return {
            doStuff(){ ... }
        };
    },
    'module',   // the core type of this instance
    () => {     // done function, will be called when the instance is ready.
        console.log('SomeModule has loaded')
    }
);

// or pass in a full object ( will be returned as is )
definitionObject = core.getDefinitionObject({
    $_type: 'module',
    name: 'SomeModule',
    dependencies: ['SomeDependency'],
    get(SomeDependency){

        return {
            render(){ ... }
        };
    },
    done(){
        console.log('SomeModule has loaded')
    }
});
```

in both cases of the example the result will be the same.