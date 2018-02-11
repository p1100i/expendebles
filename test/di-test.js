var
  path = require('path'),

  get = function get(requirePath) {
    return require(path.join(process.env.SRC_COVERAGE || '../src/js', requirePath));
  },

  di;

di = get('./dimodule/di.js');

di.test(spyOn);

get('./dimodule/expendebles');

module.exports = di;
