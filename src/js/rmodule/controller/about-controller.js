define(['app', 'di', 'build'], function (app, di, build) {
  app.controller('aboutController', [function AboutControllerFactory() {
    var
      about = this,

      package = di.get('package'),

      getDateFormat = function getDateFormat(short) {
        if (short) {
          return 'yyyy-MM-dd HH:mm';
        }

        return 'yyyy-MM-dd HH:mm:ss';
      },

      displayData = function displayData(data) {
        return data || 'n/a';
      },

      init = function init() {
        about.buildCommit  = displayData(build.commit);
        about.buildDate    = displayData(build.date);
        about.format       = displayData(getDateFormat());
        about.unixTime     = displayData(Math.floor(build.date / 1e3));
        about.version      = displayData(package.version);
      };

    init();
  }]);
});
