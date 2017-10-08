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

      getMonth = function getMonth(date) {
        return date.toLocaleString(undefined, LOCALE_MONTH_CONFIG);
      },

      getIntervalTitle = function getIntervalTitle(beg) {
        return getYear(beg) + ' ' + getMonth(beg);
      },

      getIntervalSubtitle = function getIntervalSubtitle(beg, end) {
        return pad(beg.getMonth() + 1, 2) + '.' +
               pad(beg.getDate()  + 1, 2) + '-' +
               pad(end.getMonth() + 1, 2) + '.' +
               pad(end.getDate()  + 1, 2);
      };

    return {
      'getIntervalTitle'    : getIntervalTitle,
      'getIntervalSubtitle' : getIntervalSubtitle
    };
  }]);
});
