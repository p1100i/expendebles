define(['app', 'di'], function (app, di) {
  app.controller('aboutController', [function AboutControllerFactory() {
    var
      about = this,

      build = di.get('build'),


      init = function init() {
        about.build = build;
      };

    init();
  }]);
});
