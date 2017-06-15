define(['app'], function (app) {
  app.factory('financeService', ['$rootScope', 'timeService', 'settingService', 'storageService', function financeServiceFactory($rootScope, timeService, settingService, storageService) {
    var
      interval = timeService.getInterval(),

      nextId = 1,

      items = [],

      defaultCategory = settingService.getDefaultCategory(),

      isAfterInterval = function isAfterInterval(serializedItem) {
        return interval.end <= serializedItem.t;
      },

      isInInterval = function isInInterval(serializedItem) {
        return interval.beg <= serializedItem.t && serializedItem.t <= interval.end;
      },

      getCategory = function getCategory(id) {
        return settingService.getCategory(id);
      },

      deserialize = function deserialize(itemData) {
        return {
          'amount'    : parseFloat(itemData.a),
          'category'  : getCategory(itemData.c),
          'expense'   : !!itemData.e,
          'id'        : itemData.i,
          'timestamp' : itemData.t
        };
      },

      serialize = function serialize(item) {
        return {
          'a' : item.amount,
          'c' : item.category.id,
          'e' : item.expense ? 1 : 0,
          'i' : item.id,
          't' : item.timestamp
        };
      },

      save = function save() {
        var
          i,
          len,
          item,
          instertIndex,
          serializedFinance = storageService.get('finance'),
          serializedItems   = serializedFinance.items;

        i = 0;

        while (i < serializedItems.length) {
          item = serializedItems[i];

          if (isInInterval(item)) {
            serializedItems.removeAt(i);
          } else if (isAfterInterval(item)) {
            break;
          } else {
            i++;
          }
        }

        instertIndex = i;

        len = items.length;

        while (len--) {
          serializedItems.splice(instertIndex, 0, serialize(items[len]));
        }

        storageService.set('finance', {
          'items' : serializedItems
        });
      },

      getItems = function getItems() {
        return items;
      },

      getNewTimestamp = function getNewTimestamp() {
        var
          timestamp = Date.now();

        if (timestamp < interval.beg || interval.end < timestamp) {
          timestamp = (interval.end - interval.beg) / 2 + interval.beg;
        }

        return timestamp;
      },

      createItem = function createItem(item, amount) {
        if (!item) {
          item = {};
        }

        if (!item.timestamp) {
          item.timestamp  = getNewTimestamp();
        }

        if (item.id === undefined) {
          item.id = nextId++;
        }

        if (item.expense === undefined) {
          item.expense = true;
        }

        if (item.amount === undefined) {
          item.amount = amount;
        }

        if (item.date === undefined) {
          item.date = new Date(item.timestamp);
        }

        if (item.category === undefined) {
          item.category = defaultCategory;
        }

        return item;
      },

      addAmount = function addAmount(amount) {
        amount = parseFloat(amount);

        if (isNaN(amount)) {
          throw new Error('invalid_amount');
        }

        var
          item = createItem({}, amount);

        items.push(item);

        return item;
      },

      getSum = function getSum() {
        return items.sum('amount');
      },

      sync = function sync() {
        items.clear();

        var
          i,
          len,
          serializedFinance = storageService.get('finance'),
          serializedItems   = serializedFinance.items,
          serializedItem;

        if (!serializedItems) {
          return;
        }

        len = serializedItems.length;

        for (i = 0; i < len; i++) {
          serializedItem = serializedItems[i];

          nextId = Math.max(nextId, serializedItem.i + 1);

          if (isInInterval(serializedItem)) {
            items.push(createItem(deserialize(serializedItem)));
          }
        }
      },

      parseAmount = function parseAmount(amount) {
        return Math.abs(parseFloat(amount) || 0);
      },

      sanitizeAmount = function sanitizeAmount(amount) {
        amount = parseAmount(amount);

        var
          amountStr = amount.toString();

        if (amountStr.length > 9) {
          amount = parseAmount(amountStr.substring(0, 9));
        }

        return amount;
      },

      formatAmount = function formatAmount(amount) {
        //
        // amount = sanitizeAmount(amount).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        //

        return sanitizeAmount(amount).toLocaleString();
      },

      init = function init() {
        $rootScope.$on('intervalSet', sync);

        sync();
      };

    init();

    return {
      'addAmount'       : addAmount,
      'formatAmount'    : formatAmount,
      'getItems'        : getItems,
      'getSum'          : getSum,
      'save'            : save,
      'sanitizeAmount'  : sanitizeAmount,
      'sync'            : sync
    };
  }]);
});
