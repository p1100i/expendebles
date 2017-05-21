define(['app'], function (app) {
  app.controller('appController', ['$rootScope', '$location', function appControllerFactory($rootScope, $location) {
    var
      ctrl = this,

      anchors = [],

      DATE_FORMAT_SHORT = 'yyyy-MM-dd HH:mm',

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
        // anchors.push(createAnchor('/stat',        '#!/statistic', 'View statistics'));
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

      onBodyClick = function onBodyClick() {
        $rootScope.$broadcast('bodyClick');
      },

      init = function init() {
        setMenu();

        ctrl.onBodyClick  = onBodyClick;
        ctrl.anchors      = anchors;
        ctrl.debug        = debug;
        ctrl.isSelected   = isSelected;

        ctrl.DATE_FORMAT_SHORT = DATE_FORMAT_SHORT;
      };

    init();
  }]);
});
