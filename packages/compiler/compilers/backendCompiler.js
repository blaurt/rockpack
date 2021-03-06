const deepExtend = require('deep-extend');
const _compile = require('../core/_compile');
const errorHandler = require('../errorHandler');

async function backendCompiler(conf = {}, cb, configOnly = false) {
  if (!conf) {
    conf = {};
  }

  errorHandler();

  conf = deepExtend({}, conf, {
    html: false,
    nodejs: true,
    __isBackend: true,
    compilerName: backendCompiler.name
  });

  return await _compile(conf, cb, configOnly);
}

module.exports = backendCompiler;
