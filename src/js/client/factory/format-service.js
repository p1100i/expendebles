define(['app'], function (app) {
  app.factory('formatService', [function formatServiceFactore() {
    var
      LOCALE_MONTH_CONFIG = { 'month' : 'short' },

      pad = function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
      },

      getYear = function getYear(date) {
        var
          year = date.getFullYear().toString();

        year = year.substring(year.length - 2);

        return '\'' + year;
      },

      getLocalizedMonth = function getLocalizedMonth(date) {
        return date.toLocaleString(undefined, LOCALE_MONTH_CONFIG);
      },

      getIntervalTitle = function getIntervalTitle(beg) {
        return getYear(beg) + ' ' + getLocalizedMonth(beg);
      },

      getIntervalSubtitle = function getIntervalSubtitle(beg, end) {
        beg = pad(beg.getMonth() + 1, 2) + '.' + pad(beg.getDate(), 2);
        end = pad(end.getMonth() + 1, 2) + '.' + pad(end.getDate(), 2);

        return beg + '-' + end;
      };

    return {
      'getIntervalTitle'    : getIntervalTitle,
      'getIntervalSubtitle' : getIntervalSubtitle
    };
  }]);
});
