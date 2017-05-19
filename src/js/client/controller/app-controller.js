define(['app'], function (app) {
  app.controller('appController', ['settingService', function appControllerFactory(settingService) {
    var
      ctrl = this,

      init = function init() {
        ctrl.bodyClass = settingService.get('bodyClass');
      };

    init();
  }]);
});
