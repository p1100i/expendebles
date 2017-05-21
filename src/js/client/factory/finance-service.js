define(['app'], function (app) {
  app.factory('financeService', ['$rootScope', 'settingService', 'storageService', function financeServiceFactory($rootScope, settingService, storageService) {
    var
      items,
      finance,
      defaultCategoryName,

      save = function save() {
        var
          item,
          len = items.length,
          serializedItems = [];

        while (len--) {
          item = items[len];

          serializedItems.push({
            'amount'    : item.amount,
            'category'  : item.category,
            'expense'   : item.expense,
            'timestamp' : item.timestamp
          });
        }

        storageService.set('finance', {
          'items' : serializedItems
        });
      },

      getItems = function getItems() {
        return finance.items;
      },

      extendItem = function extendItem(item, amount) {

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

      addItem = function addItem(amount) {
        amount = parseInt(amount);

        if (isNaN(amount)) {
          throw new Error('invalid_amount');
        }

        var
          item = extendItem({}, amount);

        items.push(item);

        return item;
      },

      getSum = function getSum() {
        return finance.items.sum('amount');
      },

      init = function init() {
        defaultCategoryName = settingService.getDefaultCategory().name;
        finance             = storageService.get('finance');
        items               = finance.items;

        if (!items) {
          items = finance.items = [];

          save();
        }

        var
          len = items.length;

        while (len--) {
          extendItem(items[len]);
        }

      };

    init();

    return {
      'addItem'   : addItem,
      'getItems'  : getItems,
      'getSum'    : getSum,
      'save'      : save
    };
  }]);
});
