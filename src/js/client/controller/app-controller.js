define(['app'], function (app) {
  app.controller('appController', ['$rootScope', '$location', '$window', 'debugService', function appControllerFactory($rootScope, $location, $window, debugService) {
    var
      ctrl = this,

      anchors     = [],
      rootAnchor  = {},

      DATE_FORMAT       = 'yyyy-MM-dd HH:mm:ss',
      DATE_FORMAT_SHORT = 'yyyy-MM-dd HH:mm',

      createAnchor = function createAnchor(text, href, title, icon, anchor) {
        if (!anchor) {
          anchor = {};
        }

        anchor.text  = text;
        anchor.href  = href;
        anchor.title = title;
        anchor.icon  = icon;

        return anchor;
      },

      setMenu = function setMenu() {
        anchors.push(createAnchor('/reg',         '#!/register',  'Register spendings'));
        // anchors.push(createAnchor('/stat',        '#!/statistic', 'View statistics'));
        anchors.push(createAnchor('/data',        '#!/data',      'Export/import data'));

        createAnchor('expendebles', '#!/', 'About', 'bank', rootAnchor);
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

      isRootAnchorSelected = function isRootAnchorSelected() {
        return isSelected(rootAnchor);
      },

      getSelectedAnchor = function getSelectedAnchor() {
        return anchors.find(isSelected);
      },

      onBodyClick = function onBodyClick() {
        $rootScope.$broadcast('bodyClick');
      },

      init = function init() {
        setMenu();

        $rootScope.$on('debug', debug);

        ctrl.anchors              = anchors;
        ctrl.emptyDebug           = emptyDebug;
        ctrl.isRootAnchorSelected = isRootAnchorSelected;
        ctrl.onBodyClick          = onBodyClick;
        ctrl.getSelectedAnchor    = getSelectedAnchor;
        ctrl.rootAnchor           = rootAnchor;

        ctrl.DATE_FORMAT          = DATE_FORMAT;
        ctrl.DATE_FORMAT_SHORT    = DATE_FORMAT_SHORT;

        //
        // $window.d = debugService;
        //
      };

    init();
  }]);
});
