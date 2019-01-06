var
  di = require('depi'),
  shortMethods  = require('short-methods');

di.set('build', require('./build'));

shortMethods(true);

module.exports = di;
