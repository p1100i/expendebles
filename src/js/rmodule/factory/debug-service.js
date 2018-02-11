define(['app'], function (app) {
  app.factory('debugService', ['$rootScope', function debugServiceFactory($rootScope) {
    var
      broadcast = function broadcast(msg, startDebug) {
        $rootScope.$broadcast('debug', msg, startDebug);
      };

    return {
      'broadcast' : broadcast
    };
  }]);
});
