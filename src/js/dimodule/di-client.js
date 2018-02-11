var
  di = require('./di'),
  shortMethods  = require('short-methods');

di.set('package', require('../../../package'));

shortMethods(true);

module.exports = di;
