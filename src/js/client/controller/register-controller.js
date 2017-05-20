define(['app'], function (app) {
  app.controller('registerController', ['financeService', function registerControllerFactory(financeService) {
    var
      ctrl = this,

      data = {},

      addExpense = function addExpense() {
        financeService.addItem(-data.amount);
      },

      addIncome = function addIncome(amount) {
        financeService.addItem(data.amount);
      },

      init = function init() {
        ctrl.addExpense = addExpense;
        ctrl.addIncome  = addIncome;
        ctrl.data       = data;
      };

    init();
  }]);
});
