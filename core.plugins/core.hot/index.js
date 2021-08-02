import React from 'react';
import matcher from 'matcher';

const HotComponent = (Component) => {
    let instanceId = 0;
    let instances = {};
    class HotComponent extends React.Component{
        constructor(props){
            super(props);
            instanceId += 1;
            this.instanceId = instanceId;
        }
        static replace(_Component){
            Component = ((typeof(_Component) === 'object') && _Component.default) ? _Component.default : _Component;
            Object.values(instances).forEach(ins => ins.forceUpdate())
        };
        componentDidMount(){
            instances[this.instanceId] = this;
        }
        componentWillUnmount(){
            delete instances[this.instanceId];
        }
        render(){
            let props = Object.assign({}, this.props);
            props.ref = props.__forwardRef;
            delete props.__forwardRef;
            let args = [Component, props].concat(React.Children.toArray(this.props.children));
            return React.createElement.apply(React, args);
        }
    }
    const HotForwardRef = (props, ref) => {
        let args = [HotComponent, Object.assign({ __forwardRef: ref }, props)].concat(React.Children.toArray(props.children));
        return React.createElement.apply(React, args);
    }
    let forwardedRef = React.forwardRef(HotForwardRef);
    forwardedRef.replace = HotComponent.replace;
    forwardedRef.getInstances = () => instances;
    return forwardedRef;
};

const matchAny = (id, patterns) => {
    for (let k = 0; k < patterns.length; k++) {
        if(matcher.isMatch(id, patterns[k])){
            return patterns[k];
        }
    }
}

const matchAll = (id, patterns) => matcher([id], patterns).length;

const matchRule = (id, rules) => {
    for(let i = 0; i < rules.length; i++){
        let rule = rules[i];
        let exclude = rule.exclude || [];
        let include = rule.include || [];
        if(matchAny(id, exclude)){ return; }
        if(matchAll(id, include)){
            return rule;
        }
    }
}

let wr = __webpack_require__;

export default {
    name: 'core.hot',
    init(definition, done){
        let core = this;
        core.hot = {
            cache: {},
            excluded: [],
            included: [],
            updatedAt: {},
            require: wr,
            enable(enableOptions){
                core.hot.enableOptions = enableOptions || {};
                if(module.hot){
                    core._isHotReloadingEnabled = true;
                }
            },
            match(pattern){
                return Object.keys(wr.c).filter(id => matcher.isMatch(String(id), pattern))
            },
            shouldHotReload(name){
                let enableOptions = core.hot.enableOptions || {};
                if((enableOptions.exclude || []).indexOf(name) > -1){
                    return false;
                }
                return true;
            },
            flash(){
                if(core.hot._isFlashing){ return; }
                core.hot._isFlashing = true;
                let flash = document.createElement('div');
                Object.assign(flash.style, {
                    position: 'fixed',
                    transition: '0.5s ease',
                    opacity: 1,
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#444',
                    zIndex: 999999,
                    backgroundColor: '#e7ffe7'
                });
                document.body.appendChild(flash);
                setTimeout(e => {
                    flash.style.opacity = 0;
                    setTimeout(e => {
                        document.body.removeChild(flash);
                        core.hot._isFlashing = false;
                    }, 550);
                }, 100);
            },
            onUpdate(id, newModule) {
                let options = core.hot.options;
                if(options.flash){
                    core.hot.flash(); 
                }
                if(options.onUpdate){
                    options.onUpdate(id, newModule)
                }
            },
            runHotUpdate(newModule){
                let id = newModule.id || newModule.i || newModule.filename;
                let options = core.hot.options;
                options.log('[core.hot] - updating ', id);
                let rule = matchRule(id, options.rules);
                if(rule){
                    rule.apply(id, newModule);
                    core.hot.onUpdate(id, newModule);
                }
                else if(options.propagate){
                    if(matchAny(id, options.propagate)){
                        core.hot.propagateModuleUpdate(newModule);
                    }
                }
            },
            propagateModuleUpdate(modul){
                core.hot.options.log('propagating', modul)
                if(modul.parents && modul.parents.length){
                    modul.parents.map(parentId => {
                        let parent = wr.c[parentId];
                        let handler = parent.hot.__ch_handler;
                        if(handler){
                            parent.hot.removeStatusHandler(handler);
                            parent.hot.decline();
                            delete wr.c[parentId];
                            wr(parentId);
                            parent = wr.c[parentId];
                            handler.set(parent);
                            parent.hot.__ch_handler = handler;
                            parent.hot.accept();
                            parent.hot.addStatusHandler(handler);
                            core.hot.runHotUpdate(parent);
                        }
                    });
                }
            },
            init(options){
                if(!core._isHotReloadingEnabled){ return; }
                let cache = wr.c;
                core.hot.options = {};
                if(cache){
                    // suppress duplicate modules errors
                    core.injector.unlock();
        
                    let rules = options.rules;
                    let exclude = options.exclude || [];
                    let propagate = options.propagate || [];
                    let getPluginName = options.getPluginName || (() => '');
                    let log = options.log || (() => '');
                    core.hot.options = Object.assign(options, { propagate, rules, exclude, getPluginName, log });
        
                    // run on all modules that the bundler has loaded
                    let excluded = core.hot.excluded;
                    let included = core.hot.included;
                    Object.values(cache).map(modul => {
                        let id = modul.id || modul.i || modul.filename;
                        if(exclude.length){
                            // exclude the module if it matches any of the 'exclude' patterns
                            if(matchAny(id, exclude)){ 
                                return excluded.push(id);
                            }
                        }
                        if(!matchRule(id, rules) && !matchAny(id, propagate)){
                            // exclude the module if it doesn't match any rule
                            return excluded.push(id);
                        }
                        included.push(id);
                        core.hot.cache[id] = modul;
                        const handler = status => {
                            if (status === 'idle') {
                                // we're pretty sure that the module has changed, but let's check anyway
                                cache = wr.c;
                                let newModule = require.cache[id];
                                if(newModule && (newModule !== core.hot.cache[id])){
                                    log(`[core.hot] - '${id}' has changed`);
                                    modul.hot.removeStatusHandler(handler);
                                    modul.hot.decline();
                                    modul = newModule;
                                    modul.hot.accept();
                                    modul.hot.addStatusHandler(handler);
                                    modul.hot.__ch_handler = handler;
                                    handler.set = m => modul = m;

                                    // if this module required a newly created module
                                    // we should make the new module hot as well (if it matches our rules)
                                    if(modul.children){
                                        for (let i = 0; i < modul.children.length; i++) {
                                            let childId = modul.children[i];
                                            if(!core.hot.cache[childId]){
                                                // this child is new, see if it matches our rules
                                                if(matchAny(childId, exclude)){ 
                                                    excluded.push(childId);
                                                    continue;
                                                }
                                                if(matchRule(childId, rules)){
                                                    let child = cache[childId];
                                                    if(child){
                                                        // it matches our rules and exists in the bundler's runtime
                                                        // so let's make it hot
                                                        log(`[core.hot] - new hot module'${childId}'`);
                                                        child.hot.accept();
                                                        child.hot.addStatusHandler(handler);
                                                    }
                                                }
                                            };
                                        }
                                    }

                                    // if this module is required by another module
                                    if(modul.parents && modul.parents.length){
                                        // let's check the rules to see what to do with it
                                        log(`[core.hot] - checking '${id}'`, modul);
                                        let rule = matchRule(id, rules);
                                        if(rule){
                                            log(`[core.hot] - '${id}' has matched rule`, rule);
                                            if(rule.apply){
                                                rule.apply(id, newModule);
                                                core.hot.onUpdate(id, newModule);
                                            }
                                            else{
                                                console.warn(`[core.hot] - invalid rule`, rule)
                                            }
                                        }
                                        else if(matchAny(id, propagate)){
                                            core.hot.propagateModuleUpdate(newModule);
                                        }
                                        else{
                                            log(`[core.hot] - '${id}' did not match any rule`);
                                        }
                                    }
                                    else{
                                        // if this module is not required by any other module than we do nothing
                                        // because the module will know how to handle it's own update
                                        core.hot.onUpdate(id, newModule);
                                        log(`[core.hot] - '${id}' has no parents`);
                                    }

                                    core.hot.cache[id] = newModule;
                                }
                            }
                        };
                        modul.hot.accept();
                        modul.hot.addStatusHandler(handler);
                    });
                    log(`[core.hot] - initialized`);
                }
            },
            replacePluginComponent(pluginName, definitionObject){
                let { name, dependencies = [], get } = definitionObject;
                let fullName = `${pluginName}.${definitionObject.name}`;
                core.require(dependencies, function(){
                    let componentDefinition = get.apply(core, arguments);
                    let component = core.createComponent(fullName, componentDefinition);
                    let existing = core.components[fullName];
                    if(!existing){
                        throw new Error(`cannot find component '${fullName}'`)
                    }
                    existing.replace(component);
                });
            },
            replacePluginView(pluginName, definitionObject){
                let { name, dependencies = [], get, bindings } = definitionObject;
                let fullName = `${pluginName}.${name}`;
                core.require(dependencies, function(){
                    let componentDefinition = get.apply(core, arguments);
                    let Component = core.createComponent(fullName, componentDefinition);
                    let pluginBindings = {};
                    for(let key in bindings){
                        let array = bindings[key].slice();
                        if(core.isString(array)){
                            array = [array];
                        }
                        if(array[0] !== pluginName){
                            array.unshift(pluginName);
                        }
                        if(array[0] !== 'plugins'){
                            array.unshift('plugins');
                        }
                        pluginBindings[key] = array;
                    }
                    
                    let View = core.createComponent(fullName, {
                        render() {
                            return core.bind(pluginBindings, (state) => {
                                let props = core.assign({}, this.props, state);
                                return core.createElement({
                                    type: Component,
                                    props: props,
                                    children: props.children
                                });
                            });
                        }
                    });
        
                    let existing = core.components[fullName];
                    if(!existing){
                        throw new Error(`cannot find component '${fullName}'`)
                    }
                    existing.replace(View);
                });
            },
            replacePluginAction(pluginName, definitionObject){
                let fullName = `${pluginName}.${definitionObject.name}`;
                core.Action({
                    ...definitionObject,
                    name: fullName
                });
            },
            replacePluginTree(pluginName, treeObject){
                core.set(['plugins', pluginName, treeObject]);
            }
        };
        core.HotComponent = HotComponent;
        done(core.hot);
    }
};