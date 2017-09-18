define(['app', 'angular'], function (app, angular) {
  app.controller('appController', ['$rootScope', '$location', '$window', '$timeout', 'timeService', 'debugService', function appControllerFactory($rootScope, $location, $window, $timeout, timeService, debugService) {
    var
      ctrl = this,

      regAnchor,
      statAnchor,
      dataAnchor,
      windowWidth,
      anchorsWidth,
      settingWidths,

      anchors     = [],
      rootAnchor  = {},

      MAX_ANCHOR_WIDTH = 60,

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
        regAnchor   = createAnchor({}, 'reg',   '#!/register',  'Register spendings',  'plus-circle');
        statAnchor  = createAnchor({}, 'stat',  '#!/statistic', 'View statistics',     'pie-chart');
        dataAnchor  = createAnchor({}, 'data',  '#!/data',      'Export/import data',  'cog');

        anchors.push(regAnchor, statAnchor, dataAnchor);

        createAnchor(rootAnchor, 'about', '#!/', 'About', 'bank');
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

      anchorsDisplayable = function anchorsDisplayable() {
        return isRootAnchorSelected() || anchorsWidth < windowWidth;
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

      setWidths = function setWidths() {
        windowWidth   = $window.innerWidth || document.body.clientWidth;
        anchorsWidth  = anchors.length * MAX_ANCHOR_WIDTH * 2;
      },

      enqueueSetWidths = function enqueueSetWidths() {
        if (settingWidths) {
          $timeout.cancel(settingWidths);
        }

        settingWidths = $timeout(setWidths, 500);
      },

      init = function init() {
        setMenu();
        setWidths();

        angular.element($window).on('resize', enqueueSetWidths);

        $rootScope.$on('debug',                   debug);
        $rootScope.$on('$locationChangeSuccess',  onLocationChangeSuccess);

        ctrl.anchors                = anchors;
        ctrl.anchorsDisplayable     = anchorsDisplayable;
        ctrl.emptyDebug             = emptyDebug;
        ctrl.getSelectedAnchor      = getSelectedAnchor;
        ctrl.isNormalAnchorSelected = isNormalAnchorSelected;
        ctrl.isRootAnchorSelected   = isRootAnchorSelected;
        ctrl.onBodyClick            = onBodyClick;
        ctrl.rootAnchor             = rootAnchor;
        ctrl.stepInterval           = stepInterval;

        //
        // $window.d = debugService;
        //
      };

    init();
  }]);
});
