define(['app', 'pkg', 'build'], function (app, pkg, build) {
  app.controller('aboutController', [function AboutControllerFactory() {
    var
      ctrl = this,

      init = function init() {
        ctrl.version    = pkg.version;
        ctrl.buildDate  = build.date;
      };

    init();
  }]);
});
