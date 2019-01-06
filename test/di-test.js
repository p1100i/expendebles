var
  path = require('path'),
  di = require('depi'),

  get = function get(requirePath) {
    return require(path.join(process.env.SRC_COVERAGE || '../src/js', requirePath));
  };

get('./dimodule/expendebles');

module.exports = di;
