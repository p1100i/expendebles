define(['app'], function (app) {
  app.controller('appController', ['$rootScope', '$location', '$window', 'timeService', 'debugService', function appControllerFactory($rootScope, $location, $window, timeService, debugService) {
    var
      ctrl = this,

      regAnchor,
      statAnchor,
      dataAnchor,

      anchors     = [],
      rootAnchor  = {},

      createAnchor = function createAnchor(anchor, text, href, title, icon) {
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
        regAnchor   = createAnchor({}, '/reg',         '#!/register',  'Register spendings');
        statAnchor  = createAnchor({}, '/stat',        '#!/statistic', 'View statistics');
        dataAnchor  = createAnchor({}, '/data',        '#!/data',      'Export/import data');

        anchors.push(regAnchor, statAnchor, dataAnchor);

        createAnchor(rootAnchor, '/home', '#!/', 'About', 'bank');
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

      isAnchorSelected = function isAnchorSelected(anchor) {
        var
          path = '#!' + $location.path();

        return anchor.href === path;
      },

      isRootAnchorSelected = function isRootAnchorSelected() {
        return isAnchorSelected(rootAnchor);
      },

      getSelectedAnchor = function getSelectedAnchor() {
        return anchors.find(isAnchorSelected);
      },

      isNormalAnchorSelected = function isNormalAnchorSelected() {
        var
          selectedAnchor = getSelectedAnchor();

        return selectedAnchor && selectedAnchor !== rootAnchor;
      },

      onBodyClick = function onBodyClick() {
        $rootScope.$broadcast('bodyClick');
      },

      stepInterval = function stepInterval(step) {
        timeService.stepInterval(step);
      },

      isAnchorIntervalRelated = function isAnchorIntervalRelated() {
        return isAnchorSelected(regAnchor) || isAnchorSelected(statAnchor);
      },

      onLocationChangeSuccess = function onLocationChangeSuccess() {
        delete ctrl.interval;

        if (isAnchorIntervalRelated()) {
          ctrl.interval = timeService.getInterval();
        }
      },

      init = function init() {
        setMenu();

        $rootScope.$on('debug',                   debug);
        $rootScope.$on('$locationChangeSuccess',  onLocationChangeSuccess);

        ctrl.anchors                = anchors;
        ctrl.emptyDebug             = emptyDebug;
        ctrl.isRootAnchorSelected   = isRootAnchorSelected;
        ctrl.onBodyClick            = onBodyClick;
        ctrl.getSelectedAnchor      = getSelectedAnchor;
        ctrl.isNormalAnchorSelected = isNormalAnchorSelected;
        ctrl.rootAnchor             = rootAnchor;
        ctrl.stepInterval           = stepInterval;

        //
        // $window.d = debugService;
        //
      };

    init();
  }]);
});
