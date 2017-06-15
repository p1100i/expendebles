define(['app'], function (app) {
  app.factory('storageService', ['$rootScope', 'localStorageService', function storageServiceFactory($rootScope, localStorageService) {
    var
      DEFAULTS = {
        'finance' : { 'items' : [] }
      },

      CURRENT_VERSION = 1,

      get = function get(key) {
        var
          value = localStorageService.get(key);

        if (value === null && DEFAULTS[key]) {
          localStorageService.set(key, DEFAULTS[key]);

          value = localStorageService.get(key);
        }

        return value;
      },

      set = function set(key, value) {
        localStorageService.set(key, value);

        $rootScope.$broadcast('storageChanged', key, value);
      },

      upgrade = function upgrade() {
        var
          version = localStorageService.get('version');

        if (!version) {
          localStorageService.set('version', CURRENT_VERSION);
        }
      },

      clear = function clear() {
        localStorageService.clearAll();
        upgrade();
      },

      init = function init() {
        upgrade();
      };

    init();

    return {
      'clear' : clear,
      'get'   : get,
      'set'   : set
    };
  }]);
});
