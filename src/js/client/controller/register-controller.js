define(['app'], function (app) {
  app.controller('registerController', ['financeService', function registerControllerFactory(financeService) {
    var
      ctrl = this,

      register = {},

      addExpense = function addExpense(amount) {
        return;
      },

      addIncome = function addIncome(amount) {
        return;
      },

      init = function init() {
        ctrl.addExpense = addExpense;
        ctrl.addIncome  = addIncome;
        ctrl.register   = register;
      };

    init();
  }]);
});
