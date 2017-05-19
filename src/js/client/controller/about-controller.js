define(['app'], function (app) {
  app.controller('aboutController', [function AboutControllerFactory() {
    var
      init = function init() {
        console.log('aboutController - init, YAY \\o_');
      };

    init();
  }]);
});
