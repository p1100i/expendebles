define(['app'], function (app) {
  app.controller('dataController', ['storageService', function DataControllerFactory(storageService) {
    var
      ctrl = this,

      importJSON = function importJSON(data) {
        var
          currentVersion = storageService.get('version');

        data = JSON.parse(data);

        if (data.version !== currentVersion) {
          console.error('Version mismatch imported', data.version, 'current', currentVersion);
          throw new Error('invalid_version');
        }

        storageService.set('finance', data.finance);
      },

      exportJSON = function exportJSON() {
        var
          result = JSON.stringify({
            'version' : storageService.get('version'),
            'finance' : storageService.get('finance')
          }, 0, 2);

        return result;
      },

      init = function init() {
        ctrl.importJSON = importJSON;

        ctrl.exportedJSON = exportJSON();
      };

    init();
  }]);
});
