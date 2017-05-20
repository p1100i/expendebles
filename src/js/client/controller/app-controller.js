define(['app'], function (app) {
  app.controller('appController', ['$location', 'settingService', function appControllerFactory($location, settingService) {
    var
      ctrl = this,

      anchors = [],

      createAnchor = function createAnchor(text, href, title, icon) {
        return {
          'text'  : text,
          'href'  : href,
          'title' : title,
          'icon'  : icon
        };
      },

      setMenu = function setMenu() {
        anchors.push(createAnchor('/reg',         '#!/register',  'Register spendings'));
        anchors.push(createAnchor('/stat',        '#!/statistic', 'View statistics'));
        anchors.push(createAnchor('/help',        '#!/help',      'View help'));
        anchors.push(createAnchor('expendebles',  '#!/',          'About', 'bank'));
      },

      debug = function debug() {
        debugger;
      },

      isSelected = function isSelected(anchor) {
        var
          path = '#!' + $location.path();

        return anchor.href === path;
      },

      init = function init() {
        setMenu();

        ctrl.anchors    = anchors;
        ctrl.debug      = debug;
        ctrl.isSelected = isSelected;
      };

    init();
  }]);
});
