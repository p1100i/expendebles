define(['app'], function (app) {
  app.controller('appController', ['$rootScope', '$location', '$window', 'debugService', function appControllerFactory($rootScope, $location, $window, debugService) {
    var
      ctrl = this,

      anchors = [],

      DATE_FORMAT       = 'yyyy-MM-dd HH:mm:ss',
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

      debug = function debug($event, msg, startDebug) {
        ctrl.debug += ' ' + msg;

        if (startDebug) {
          debugger;
        }
      },

      emptyDebug = function emptyDebug() {
        ctrl.debug = undefined;
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

        $rootScope.$on('debug', debug);

        ctrl.anchors      = anchors;
        ctrl.emptyDebug   = emptyDebug;
        ctrl.isSelected   = isSelected;
        ctrl.onBodyClick  = onBodyClick;

        ctrl.DATE_FORMAT       = DATE_FORMAT;
        ctrl.DATE_FORMAT_SHORT = DATE_FORMAT_SHORT;

        //
        // $window.d = debugService;
        //
      };

    init();
  }]);
});
