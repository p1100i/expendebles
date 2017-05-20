define(['app'], function (app) {
  app.controller('statisticController', ['$scope', 'financeService', 'storageService', function statisticControllerFactory($scope, financeService, storageService) {
    var
      ctrl = this,

      onStorageChanged = function onStorageChanged($event, key, value) {
        console.log('change', key, value);
      },

      init = function init() {
        ctrl.sum = financeService.getSum();

        $scope.$on('storageChanged', onStorageChanged);
      };

    init();
  }]);
});
