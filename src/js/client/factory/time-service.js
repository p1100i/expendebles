define(['app'], function (app) {
  app.factory('timeService', ['$rootScope', 'storageService', function timeServiceFactory($rootScope, storageService) {
    var
      interval = {},

      LOCALE_MONTH_CONFIG = { 'month' : 'short' },

      setInterval = function setInterval(timestamp) {
        var
          date      = new Date(timestamp),
          begDate   = new Date(date.getFullYear(), date.getMonth(), 1),
          endDate   = new Date(date.getFullYear(), date.getMonth() + 1);

        interval.beg    = begDate.getTime();
        interval.end    = endDate.getTime() - 1;
        interval.title  = date.toLocaleString(undefined, LOCALE_MONTH_CONFIG);

        $rootScope.$broadcast('intervalSet', interval);
      },

      backwardInterval = function backwardInterval() {
        setInterval(interval.beg - 1000);
      },

      forwardInterval = function forwardInterval() {
        setInterval(interval.end + 1000);
      },

      stepInterval = function stepInterval(times) {
        var
          len = Math.abs(times);

        while (len--) {
          if (times > 0) {
            forwardInterval();
          } else {
            backwardInterval();
          }
        }
      },

      getInterval = function getInterval() {
        return interval;
      },

      init = function init() {
        var
          timestamp = parseInt(storageService.get('lastIntervalTime'));

        if (isNaN(timestamp)) {
          timestamp = Date.now();
        }

        setInterval(timestamp);
      };

    init();

    return {
      'getInterval'   : getInterval,
      'stepInterval'  : stepInterval
    };
  }]);
});
