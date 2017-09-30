define(['app'], function (app) {
  app.factory('storageService', ['$rootScope', '$window', 'localStorageService', function storageServiceFactory($rootScope, $window, localStorageService) {
    var
      DEFAULTS = {
        'finance'   : { 'transactions' : [], 'balances' : [] },
        'monthBeg'  : 1,
        'version'   : 2
      },

      CURRENT_VERSION = 2,

      MAX_STORAGE_IN_BYTES = 1024 * 1024 * 5,

      upgrades = {},

      getValue = function getValue(key) {
        return localStorageService.get(key);
      },

      setValue = function setValue(key, value) {
        localStorageService.set(key, value);

        return getValue(key);
      },


      get = function get(key) {
        var
          value = localStorageService.get(key);

        if (value === null && DEFAULTS[key]) {
          value = setValue(key, DEFAULTS[key]);
        }

        return value;
      },

      set = function set(key, value) {
        setValue(key, value);

        $rootScope.$broadcast('storageChanged', key, value);
      },

      upgrade = function upgrade() {
        var
          version = get('version');

        if (!version) {
          throw Error('undefined_version');
        }

        while (version !== CURRENT_VERSION) {
          version++;
          upgrades[version]();
          setValue('version', version);
        }
      },

      upgradeTo2 = function upgradeTo2() {
        var
          finance   = getValue('finance'),
          items     = finance.items;

        if (items) {
          delete finance.items;
          finance.transactions = items;
        }

        finance.balances = [];

        setValue('finance', finance);
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
          return mbytes.toFixed(2) + ' MiB(s)';
        }

        if (kbytes > 1) {
          return kbytes.toFixed(2) + ' KiB(s)';
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
        upgrades['2'] = upgradeTo2;

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
