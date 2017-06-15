define(['app', 'pkg', 'build'], function (app, pkg, build) {
  app.controller('aboutController', ['settingService', function AboutControllerFactory(settingService) {
    var
      ctrl = this,

      init = function init() {
        ctrl.format       = settingService.getDateFormat();
        ctrl.version      = pkg.version;
        ctrl.buildDate    = build.date;
        ctrl.unixTime     = Math.floor(build.date / 1e3);
        ctrl.buildCommit  = build.commit;
      };

    init();
  }]);
});
