define(['app'], function (app) {
  app.controller('dataController', ['$document', '$window', 'financeService', 'storageService', 'timeService', function DataControllerFactory($document, $window, financeService, storageService, timeService) {
    var
      ctrl = this,

      importSerialized = function importSerialized(data) {
        var
          currentVersion = storageService.get('version');

        data = $window.JSON.parse($window.atob(data));

        if (data.version !== currentVersion) {
          console.error('Version mismatch imported', data.version, 'current', currentVersion);
          throw new Error('invalid_version');
        }

        storageService.set('finance', data.finance);
      },

      serialize = function serialize() {
        var
          result = $window.btoa($window.JSON.stringify({
            'version'   : storageService.get('version'),
            'finance'   : storageService.get('finance')
          }));

        return result;
      },

      copySerialized = function copySerialized() {
        var
          doc       = $document[0],
          textarea  = doc.querySelector('textarea.serialized'),
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

      setSerialized = function setSerialized() {
        ctrl.serialized = serialize();
      },

      setUsage = function setUsage() {
        var
          usage = storageService.getUsage();

        ctrl.usageHuman   = usage.human;
        ctrl.usagePercent = usage.percent.toFixed(2) + '%';
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
          financeService.sync();
        }

        setUsage();
        setSerialized();
      },

      setMonthBeg = function setMonthBeg() {
        ctrl.monthBeg   = timeService.getMonthBeg();
        ctrl.monthBegs  = timeService.getPossibleMonthBegs();
      },

      onMonthBegChanged = function onMonthBegChanged(newMonthBeg) {
        timeService.setMonthBeg(parseInt(newMonthBeg));
        setMonthBeg();
      },

      init = function init() {
        ctrl.clear                  = clear;
        ctrl.copySerialized         = copySerialized;
        ctrl.importSerialized       = importSerialized;
        ctrl.onMonthBegChanged      = onMonthBegChanged;

        setMonthBeg();
        setUsage();
        setSerialized();
      };

    init();
  }]);
});
