define(['app'], function (app) {
  app.factory('storageService', ['$rootScope', 'localStorageService', function storageServiceFactory($rootScope, localStorageService) {
    var
      DEFAULTS = {
        'finance' : {}
      },

      CURRENT_VERSION = 1,

      get = function get(key) {
        var
          value = localStorageService.get(key);

        return value === null ? DEFAULTS[key] : value;
      },

      set = function set(key, value) {
        localStorageService.set(key, value);

        $rootScope.$broadcast('storageChanged', key, value);
      },

      init = function init() {
        var
          version = localStorageService.get('version');

        if (!version) {
          localStorageService.set('version', CURRENT_VERSION);
        }
      };

    init();

    return {
      'get' : get,
      'set' : set
    };
  }]);
});
