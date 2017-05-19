define(['app'], function (app) {
  app.controller('registerController', ['settingService', function registerControllerFactory(settingService) {
    var
      ctrl = this,

      expense = {},

      init = function init() {
        ctrl.expense = expense;
      };

    init();
  }]);
});
