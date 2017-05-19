var
  path = require('path'),

  processRequire = function processRequire(requirePath) {
    return require(path.join(process.env.SRC_COVERAGE || '../src/js/node', requirePath));
  };

module.exports = processRequire;
