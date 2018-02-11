define(['app'], function (app) {
  app.factory('storageService', ['$rootScope', '$window', 'localStorageService', function storageServiceFactory($rootScope, $window, localStorageService) {
    var
      DEFAULTS = {
        'balances'      : [],
        'transactions'  : [],
        'monthBeg'      : 1,
        'version'       : 4
      },

      CURRENT_VERSION = 4,

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
      },

      upgrade = function upgrade() {
        var
          version = get('version'),
          upgrader;

        if (!version) {
          throw Error('undefined_version');
        }

        while (version !== CURRENT_VERSION) {
          version++;

          upgrader = upgrades[version];

          if (upgrader) {
            upgrader();
          } else {
            console.warn('upgrader missing w/ version:', version);
          }

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

      upgradeTo3 = function upgradeTo3() {
        var
          month,
          balance,
          finance   = getValue('finance'),
          balances  = finance.balances,
          len       = balances.length;

        while (len--) {
          balance = balances[len];

          if (balance.t) {
            month = new Date(balance.t);
            month = month.getMonth();

            delete balance.t;
            balance.m = month;
          }
        }

        setValue('finance', finance);
      },

      upgradeTo4 = function upgradeTo4() {
        var
          finance       = getValue('finance'),
          balances      = finance.balances,
          transactions  = finance.transactions;

        setValue('balances',      balances);
        setValue('transactions',  transactions);

        localStorageService.remove('finance');
      },

      clear = function clear() {
        localStorageService.clearAll();
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
        upgrades['3'] = upgradeTo3;
        upgrades['4'] = upgradeTo4;

        upgrade();
      };

    init();

    return {
      'clear'     : clear,
      'get'       : get,
      'getUsage'  : getUsage,
      'upgrade'   : upgrade,
      'set'       : set
    };
  }]);
});
