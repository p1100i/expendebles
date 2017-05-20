define(['app'], function (app) {
  app.controller('appController', ['$location', function appControllerFactory($location) {
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
        anchors.push(createAnchor('/data',        '#!/data',      'Export/import data'));
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
