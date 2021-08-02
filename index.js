  
import Core from './core.skeleton'

import extend from './core.plugins/core.plugin.extend'
import uuid from './core.plugins/core.uuid'
import eventEmitter from './core.plugins/core.eventEmitter'
import injector from './core.plugins/core.injector'
import injectorPlugin from './core.plugins/core.plugin.injector'
import reloadPlugin from './core.plugins/core.reloadPlugin'
import monitor from './core.plugins/core.monitor'
import object from './core.plugins/core.get-definition-object'
import channels from './core.plugins/core.plugin.channels'
import hooks from './core.plugins/core.plugin.hooks'
import imports from './core.plugins/core.imports'
import importsPlugin from './core.plugins/core.plugin.imports'
import react from './core.plugins/core.imports.react'
import createReactClass from './core.plugins/core.imports.create-react-class'
import propTypes from './core.plugins/core.imports.prop-types'
import baobab from './core.plugins/core.imports.baobab'
import q from './core.plugins/core.imports.q'
import dom from './core.plugins/core.imports.react-dom'
import array from './core.plugins/core.Array'
import types from './core.plugins/core.types'
import build from './core.plugins/core.build'
import typesPlugin from './core.plugins/core.plugin.types'
import prepend from './core.plugins/core.prepend'
import modules from './core.plugins/core.modules'
import components from './core.plugins/core.components'
import actions from './core.plugins/core.actions'
import tree from './core.plugins/core.tree'
import bindings from './core.plugins/core.bindings'
import views from './core.plugins/core.views'
import templates from './core.plugins/core.templates'
import bequeath from './core.plugins/core.bequeath'
import mapTypes from './core.plugins/core.mapTypes'
import apps from './core.plugins/core.apps'
import plugins from './core.plugins/core.plugins'
import modulesPlugin from './core.plugins/core.plugin.modules'
import actionsPlugin from './core.plugins/core.plugin.actions'
import treePlugin from './core.plugins/core.plugin.tree'
import bind from './core.plugins/core.plugin.bind'
import componentsPlugin from './core.plugins/core.plugin.components'
import viewsPlugin from './core.plugins/core.plugin.views'
import hot from './core.plugins/core.hot'
import list from './core.plugins/core.list'

/**
 * @name clientCore
 */
var core = new Core({
    name: 'client-core',
    plugins: [
      extend,     
      uuid,
      eventEmitter,
      injector,
      injectorPlugin,
      reloadPlugin,
      monitor,
      object,
      channels,
      hooks,
      imports,
      importsPlugin,
      react,
      createReactClass,
      propTypes,
      baobab,
      q,
      dom,
      array,
      types,
      build,
      typesPlugin,
      prepend,
      modules,
      components,
      actions,
      tree,
      bindings,
      views,
      templates,
      bequeath,
      mapTypes,
      apps,
      plugins,
      modulesPlugin,
      actionsPlugin,
      treePlugin,
      bind,      
      componentsPlugin,
      viewsPlugin,
      hot,
      list,
    ]
});

core.version = require('./package.json').version;

if(typeof window !== 'undefined'){ window.core = core; }

export default core;
