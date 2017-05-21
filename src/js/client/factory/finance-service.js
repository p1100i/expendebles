define(['app'], function (app) {
  app.factory('financeService', ['$rootScope', 'storageService', function financeServiceFactory($rootScope, storageService) {
    var
      items,
      finance,

      save = function save() {
        var
          item,
          len = items.length,
          serializedItems = [];

        while (len--) {
          item = items[len];

          serializedItems.push({
            'timestamp' : item.timestamp,
            'expense'   : item.expense,
            'amount'    : item.amount
          });
        }

        storageService.set('finance', {
          'items' : serializedItems
        });
      },

      getItems = function getItems() {
        return finance.items;
      },

      addItem = function addItem(amount) {
        amount = parseInt(amount);

        if (isNaN(amount)) {
          throw new Error('invalid_amount');
        }

        var
          item = {
            'timestamp' : Date.now(),
            'expense'   : true,
            'amount'    : amount
          };

        items.push(item);

        return item;
      },

      getSum = function getSum() {
        return finance.items.sum('amount');
      },

      init = function init() {
        var
          item;

        finance = storageService.get('finance');
        items   = finance.items;

        if (!items) {
          items = finance.items = [];

          save();
        }

        var
          len = items.length;

        while (len--) {
          item      = items[len];
          item.date = new Date(item.timestamp);
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
