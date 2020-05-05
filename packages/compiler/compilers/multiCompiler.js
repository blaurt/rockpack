const webpack = require('webpack');
const { isNumber, isFunction, isString } = require('valid-types');
const fpPromise = require('../utils/findFreePort');
const defaultProps = require('../defaultProps');
const run = require('../modules/run');
const getRandom = require('../utils/getRandom');
const makeMode = require('../modules/makeMode');
const commonMultiValidator = require('../utils/commonMultiValidators');
const errorHandler = require('../errorHandler');

async function multiCompiler(props = []) {
  errorHandler();
  const mode = makeMode();
  commonMultiValidator(props);

  const ports = {};
  const browserSyncPort = [];
  const serverDev = [];
  const argumentsCollection = {};
  const configs = {};
  const webpackConfigs = [];
  const liveReload = [];

  // set id
  props.forEach(({ config }, index) => {
    config.id = `config-${index}`;
    ports[config.id] = {};
    configs[config.id] = {};
  });

  // check intersection ports
  for (let i = 0, l = props.length; i < l; i++) {
    const { config } = props[i];

    if (config &&
      config.server &&
      isNumber(config.server.browserSyncPort) &&
      !ports[config.id].browserSyncPort) {
      let port = await fpPromise(config.server.browserSyncPort);

      if (browserSyncPort.indexOf(port) >= 0) {
        port = await fpPromise(config.server.browserSyncPort + getRandom(100));
      }

      browserSyncPort.push(port);
      ports[config.id].browserSyncPort = port;
    }

    if (!ports[config.id].liveReload) {
      let port = await fpPromise(35729);
      if (liveReload.indexOf(port) >= 0) {
        port = await fpPromise(35729 + getRandom(100));
      }
      liveReload.push(port);
      ports[config.id].liveReload = port;
    }

    if (config && config.server && isNumber(config.server.port)) {
      if (!ports[config.id].server) {
        let port = await fpPromise(config.server.port);
        if (serverDev.indexOf(port) >= 0) {
          port = await fpPromise(config.server.port + getRandom(100));
        }
        serverDev.push(port);
        ports[config.id].server = port;
      }
    } else {
      let port = await fpPromise(defaultProps.server.port);
      if (serverDev.indexOf(port) >= 0) {
        port = await fpPromise(defaultProps.server.port + getRandom(100));
      }
      ports[config.id].server = port;
      serverDev.push(port);
    }
  }

  props.forEach(({ config }) => {
    if (!config.server) {
      config.server = {};
    }
    if (isNumber(ports[config.id].server)) {
      config.server.port = ports[config.id].server;
    }
    if (isNumber(ports[config.id].browserSyncPort)) {
      config.server.browserSyncPort = ports[config.id].browserSyncPort;
    }
  });

  // eslint-disable-next-line no-shadow
  props.forEach(props => {
    argumentsCollection[props.config.id] = [];

    switch (props.compilerName) {
      case 'analyzerCompiler':
      case 'frontendCompiler':
      case 'backendCompiler':
        argumentsCollection[props.config.id].push(props.config);
        if (isFunction(props.callback)) {
          argumentsCollection[props.config.id].push(props.callback);
        } else {
          argumentsCollection[props.config.id].push(null);
        }
        argumentsCollection[props.config.id].push(true);
        break;
      case 'libraryCompiler':
        if (isString(props.libraryName)) {
          argumentsCollection[props.config.id].push(props.libraryName);
        }
        argumentsCollection[props.config.id].push(props.config);
        if (isFunction(props.callback)) {
          argumentsCollection[props.config.id].push(props.callback);
        } else {
          argumentsCollection[props.config.id].push(null);
        }
        argumentsCollection[props.config.id].push(true);
        break;
      case 'markupCompiler':
        if (isString(props.paths)) {
          argumentsCollection[props.config.id].push(props.paths);
        }
        argumentsCollection[props.config.id].push(props.config);
        if (isFunction(props.callback)) {
          argumentsCollection[props.config.id].push(props.callback);
        } else {
          argumentsCollection[props.config.id].push(null);
        }
        argumentsCollection[props.config.id].push(true);
        break;
    }
  });

  for (let i = 0, l = props.length; i < l; i++) {
    const { compiler, config } = props[i];
    const { webpackConfig, conf } = await compiler.apply(compiler, argumentsCollection[config.id]);
    props[i].config = conf;
    webpackConfigs.push(webpackConfig);
  }

  return await run(webpackConfigs, mode, webpack, props.map(({ config }) => config));
}

module.exports = multiCompiler;
