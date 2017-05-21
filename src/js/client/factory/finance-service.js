define(['app'], function (app) {
  app.factory('financeService', ['$rootScope', 'storageService', function financeServiceFactory($rootScope, storageService) {
    var
      items,
      finance,

      save = function save() {
        storageService.set('finance', finance );
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
            'amount'    : amount
          };

        items.push(item);

        return item;
      },

      getSum = function getSum() {
        return finance.items.sum('amount');
      },

      init = function init() {
        finance = storageService.get('finance');
        items   = finance.items;

        if (!items) {
          items = finance.items = [];

          save();
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
