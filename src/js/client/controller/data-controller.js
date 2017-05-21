define(['app'], function (app) {
  app.controller('dataController', ['$document', '$window', 'storageService', function DataControllerFactory($document, $window, storageService) {
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

      copyJSON = function copyJSON() {
        var
          doc       = $document[0],
          textarea  = doc.querySelector('textarea.json'),
          successful;

        textarea.select();

        try {
          successful = doc.execCommand('copy');

          if (!successful) {
            throw successful;
          }
        } catch (err) {
          //
          // Preselect the textarea if copy not supported.
          //
          textarea.setSelectionRange(0, 9999);
        }

      },

      setJSON = function setJSON() {
        ctrl.json = exportJSON();
      },

      clear = function clear() {
        var
          confirmMessage,
          confirmed;

        confirmMessage  = [
          'Are you sure?',
          'By hitting OK you will erase all registered entries from before.'
        ].join('\n\n');

        confirmed = $window.confirm(confirmMessage);

        if (confirmed) {
          storageService.clear();
        }

        setJSON();
      },

      init = function init() {
        ctrl.importJSON = importJSON;
        ctrl.copyJSON   = copyJSON;
        ctrl.clear      = clear;

        setJSON();
      };

    init();
  }]);
});
