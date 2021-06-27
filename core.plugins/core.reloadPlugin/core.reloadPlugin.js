module.exports = {
    name: 'core.reloadPlugin',
    extend: {
        reloadPlugin(pluginDef){
            core.injector.unlock();
            core.plugin(pluginDef);
            core.injector.lock();
            core.emit('hotUpdate');
        }
    }
};