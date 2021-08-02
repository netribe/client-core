import reloadPlugin from './core.reloadPlugin.js'
export default reloadPlugin;

if(module.hot) {
    module.hot.accept('./core.reloadPlugin.js', function() {
        var plugin = require('./core.reloadPlugin.js');
        core.plugin(plugin);
    });
}