define(['app', 'lzString'], function (app, lzString) {
  app.controller('configController', ['$document', '$window', 'financeService', 'storageService', 'timeService', function DataControllerFactory($document, $window, financeService, storageService, timeService) {
    var
      ctrl = this,

      serialize = function serialize() {
        var
          version     = storageService.get('version'),
          serialized  = $window.JSON.stringify({
            'balances'      : storageService.get('balances'),
            'interval'      : storageService.get('interval'),
            'monthBeg'      : storageService.get('monthBeg'),
            'transactions'  : storageService.get('transactions'),
            'version'       : version
          });

        serialized = 'version:' + version + '!' + lzString.compressToBase64(serialized);

        return serialized;
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

      setMonthBeg = function setMonthBeg() {
        ctrl.monthBeg   = timeService.getMonthBeg();
        ctrl.monthBegs  = timeService.getPossibleMonthBegs();
      },

      sync = function sync() {
        setMonthBeg();
        setUsage();
        setSerialized();
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

        sync();
      },

      onMonthBegChanged = function onMonthBegChanged(newMonthBeg) {
        newMonthBeg = parseInt(newMonthBeg);

        timeService.setMonthBeg(newMonthBeg);

        sync();
      },

      importSerialized = function importSerialized(serialized) {
        var
          versionBeg  = serialized.indexOf(':'),
          versionEnd  = serialized.indexOf('!'),
          version     = parseInt(serialized.substring(versionBeg + 1, versionEnd)),
          compressed,
          decompressed,
          data,
          key;

        if (isNaN(version)) {
          console.error('Could not parse version to import.');

          throw new Error('nan_version');
        }

        compressed    = serialized.substring(versionEnd + 1);
        decompressed  = lzString.decompressFromBase64(compressed);
        data          = $window.JSON.parse(decompressed);

        if (data.version !== version) {
          console.error('Compressed version does not match the given version.');

          throw new Error('invalid_version');
        }

        storageService.clear();

        //
        // DO upgrade steps if needed.
        //

        for (key in data) {
          storageService.set(key, data[key]);
        }

        storageService.upgrade();

        if (data.monthBeg) {
          onMonthBegChanged(data.monthBeg);
        }
      },


      init = function init() {
        ctrl.clear                  = clear;
        ctrl.copySerialized         = copySerialized;
        ctrl.importSerialized       = importSerialized;
        ctrl.onMonthBegChanged      = onMonthBegChanged;

        sync();
      };

    init();
  }]);
});
