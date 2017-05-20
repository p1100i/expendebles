define(['app'], function (app) {
  app.factory('financeService', ['$rootScope', 'storageService', function financeServiceFactory($rootScope, storageService) {
    var
      items,
      finance,

      save = function save() {
        storageService.set('finance', finance );
      },

      addItem = function addItem(amount) {
        amount = parseInt(amount);

        if (isNaN(amount)) {
          throw new Error('invalid_amount');
        }

        items.push({
          'timestamp' : Date.now(),
          'amount'    : amount
        });

        save();
      },

      getSum = function getSum() {
        return finance.items.sum('amount');
      },

      init = function init() {
        finance = storageService.get('finance');
        items   = finance.items;

        if (!items) {
          items = finance.items = [];
        }
      };

    init();

    return {
      'addItem' : addItem,
      'getSum'  : getSum
    };
  }]);
});
