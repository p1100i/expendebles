define(['app'], function (app) {
  app.factory('financeService', ['$rootScope', 'storageService', function financeServiceFactory($rootScope, storageService) {
    var
      finance = storageService.get('finance'),

      init = function init() {
      };

    init();

    return {
    };
  }]);
});
