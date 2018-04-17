define(['app'], function (app) {
  app.factory('timeService', ['$rootScope', 'storageService', 'formatService', function timeServiceFactory($rootScope, storageService, formatService) {
    var
      MAX_MONTH_BEG = 28,
      MS_IN_DAY     = 24 * 60 * 60 * 1000,


      interval  = {},
      monthBegs = [MAX_MONTH_BEG],
      monthBeg  = storageService.get('monthBeg'),

      loadSelectedInterval = function loadSelectedInterval() {
        var
          selectedInterval = parseInt(storageService.get('interval'));

        if (isNaN(selectedInterval)) {
          selectedInterval = Date.now();
        }

        return selectedInterval + monthBeg * MS_IN_DAY;
      },

      saveSelectedInterval = function saveSelectedInterval(date) {
        date = new Date(date.getFullYear(), date.getMonth());

        storageService.set('interval', date.getTime());
      },

      setInterval = function setInterval(timestamp) {
        if (!timestamp) {
          timestamp = loadSelectedInterval();
        }

        var
          begDate,
          endDate,
          date            = new Date(timestamp),
          days            = date.getDate(),
          monthTranslate  = days < monthBeg ? 0 : 1,
          begMonth        = date.getMonth() - 1 + monthTranslate,
          endMonth        = (begMonth + 1) % 12,
          begYear         = date.getFullYear(),
          endYear         = begYear;

        if (endMonth === 0) {
          endYear++;
        }

        begDate = new Date(begYear, begMonth, monthBeg);
        endDate = new Date(endYear, endMonth, monthBeg);

        //
        // endDate is calculated the same way as the next intervals begDate,
        // hence remove one millisec.
        //
        endDate = new Date(endDate.getTime() - 1);

        interval.begDate    = begDate;
        interval.endDate    = endDate;
        interval.beg        = begDate.getTime();
        interval.end        = endDate.getTime();
        interval.begMonth   = begMonth;
        interval.endMonth   = endMonth;
        interval.begYear    = begYear;
        interval.endYear    = endYear;
        interval.title      = formatService.getIntervalTitle(begDate, endDate);
        interval.subtitle   = formatService.getIntervalSubtitle(begDate, endDate);

        saveSelectedInterval(begDate);

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

      getMonthBeg = function getMonthBeg() {
        return monthBeg;
      },

      setMonthBeg = function setMonthBeg(newMonthBeg) {
        if (!newMonthBeg || monthBegs.indexOf(newMonthBeg) === -1) {
          return;
        }

        monthBeg = newMonthBeg;

        storageService.set('monthBeg', monthBeg);

        setInterval();
      },

      getPossibleMonthBegs = function getPossibleMonthBegs() {
        return monthBegs;
      },

      init = function init() {
        var
          maxMonthBeg = MAX_MONTH_BEG;

        while (maxMonthBeg--) {
          monthBegs.unshift(maxMonthBeg);
        }

        setInterval();
      };

    init();

    return {
      'getInterval'           : getInterval,
      'setInterval'           : setInterval,
      'getMonthBeg'           : getMonthBeg,
      'setMonthBeg'           : setMonthBeg,
      'getPossibleMonthBegs'  : getPossibleMonthBegs,
      'stepInterval'          : stepInterval
    };
  }]);
});
