define(['app'], function (app) {
  app.factory('storageService', ['$rootScope', '$window', 'localStorageService', function storageServiceFactory($rootScope, $window, localStorageService) {
    var
      CURRENT_VERSION = 5,

      DEFAULTS = {
        'balances'      : [],
        'transactions'  : [],
        'monthBeg'      : 1,
        'version'       : CURRENT_VERSION
      },

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

      /**
       * Finance was storing items which was not correct
       * w/ the entry of balances, as they are items as
       * well.
       *
       * This function moves existing .items to
       * .transactions and adds .balances as well.
       */
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

      /**
       * To make monthly interval configurable there was
       * no point to keep timestamps in balance items.
       *
       * This function removes timestamps and adds .m as
       * property to track the specific month of the balance.
       *
       * (intervals are considered now month-based)
       */
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

      /**
       * Finance items were kept in one array as finance, which
       * was hard to manipulate.
       *
       * This function splits them up.
       */
      upgradeTo4 = function upgradeTo4() {
        var
          finance       = getValue('finance'),
          balances      = finance.balances,
          transactions  = finance.transactions;

        setValue('balances',      balances);
        setValue('transactions',  transactions);

        localStorageService.remove('finance');
      },

      /**
       * Balances did not track their year, which caused bugs
       * in balance registration and in the calculation of
       * unregistered sums between months/intervals.
       *
       * This function add the .y property for balances w/o
       * any special logic, simply as 2017.
       */
      upgradeTo5 = function upgradeTo5() {
        var
          balance,
          balances = getValue('balances'),
          len = balances.length;

        while (len--) {
          balance   = balances[len];
          balance.y = 2017;
        }

        setValue('balances', balances);
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
        upgrades['5'] = upgradeTo5;

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
