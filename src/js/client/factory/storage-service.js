define(['app'], function (app) {
  app.factory('storageService', ['$rootScope', '$window', 'localStorageService', function storageServiceFactory($rootScope, $window, localStorageService) {
    var
      DEFAULTS = {
        'finance' : { 'items' : [] }
      },

      CURRENT_VERSION = 1,

      MAX_STORAGE_IN_BYTES = 1024 * 1024 * 5,

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

      getBytesHumanReadable = function getBytesHumanReadable(bytes) {
        var
          kbytes = bytes  / 1024,
          mbytes = kbytes / 1024;

        if (mbytes > 1) {
          return mbytes + ' MiB(s)';
        }

        if (kbytes > 1) {
          return kbytes + ' KiB(s)';
        }

        return bytes + ' byte(s)';
      },

      getUsage = function getUsage() {
        var
          bytes   = JSON.stringify($window.localStorage).length * 2,
          percent = bytes / MAX_STORAGE_IN_BYTES,
          human   = getBytesHumanReadable(bytes);

        return {
          'bytes'   : bytes,
          'human'   : human,
          'percent' : percent
        };
      },

      init = function init() {
        upgrade();
      };

    init();

    return {
      'clear'     : clear,
      'get'       : get,
      'getUsage'  : getUsage,
      'set'       : set
    };
  }]);
});
