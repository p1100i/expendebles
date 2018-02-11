define(['app'], function (app) {
  app.factory('settingService', ['$rootScope', 'localStorageService', function settingServiceFactory($rootScope, localStorageService) {
    var
      DEFAULTS = {
        'bodyClass' : 'simple'
      },

      CURRENT_VERSION = 1,

      get = function get(key) {
        var
          value = localStorageService.get(key);

        return value === null ? DEFAULTS[key] : value;
      },

      set = function set(key, value) {
        localStorageService.set(key, value);

        $rootScope.$broadcast('settingChanged', key, value);
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
