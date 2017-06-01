define(['app'], function (app) {
  app.factory('financeService', ['$rootScope', 'settingService', 'storageService', function financeServiceFactory($rootScope, settingService, storageService) {
    var
      items = [],

      defaultCategoryName,

      save = function save() {
        var
          item,
          len = items.length,
          serializedItems = [];

        while (len--) {
          item = items[len];

          serializedItems.push({
            'a' : item.amount,
            'c' : item.category,
            'e' : item.expense ? 1 : 0,
            't' : item.timestamp
          });
        }

        storageService.set('finance', {
          'items' : serializedItems
        });
      },

      getItems = function getItems() {
        return items;
      },

      createItem = function createItem(item, amount) {
        if (!item) {
          item = {};
        }

        if (!item.timestamp) {
          item.timestamp  = Date.now();
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
          item.category = defaultCategoryName;
        }

        return item;
      },

      deserialize = function deserialize(itemData) {
        return {
          'amount'    : itemData.a,
          'category'  : itemData.c,
          'expense'   : !!itemData.e,
          'timestamp' : itemData.t
        };
      },

      addItem = function addItem(amount) {
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
        defaultCategoryName = settingService.getDefaultCategory().name;

        var
          serializedFinance = storageService.get('finance'),
          serializedItems   = serializedFinance.items;

        if (!serializedItems) {
          return;
        }

        var
          len = serializedItems.length;

        while (len--) {
          items.push(createItem(deserialize(serializedItems[len])));
        }
      },

      init = function init() {
        sync();
      };

    init();

    return {
      'addItem'   : addItem,
      'getItems'  : getItems,
      'getSum'    : getSum,
      'save'      : save,
      'sync'      : sync
    };
  }]);
});
