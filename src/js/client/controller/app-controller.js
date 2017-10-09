define(['app', 'angular'], function (app, angular) {
  app.controller('appController', ['$rootScope', '$location', '$window', '$timeout', 'timeService', 'debugService', function appControllerFactory($rootScope, $location, $window, $timeout, timeService, debugService) {
    var
      ctrl = this,

      leftAnchors   = [],
      rightAnchors  = [],

      createAnchor = function createAnchor(name, href, title, icon, disabled) {
        var
          anchor = {};

        anchor.name     = name;
        anchor.href     = href;
        anchor.title    = title;
        anchor.icon     = icon;
        anchor.enabled  = !disabled;

        return anchor;
      },

      setMenu = function setMenu() {
        leftAnchors.push(
          createAnchor('about', '#!/',          'About',            'bank'),
          createAnchor('reg',   '#!/register',  'Register entries', 'plus-circle'),
          createAnchor('stat',  '#!/statistic', 'View statistics',  'pie-chart')
        );

        rightAnchors.push(
          createAnchor('trend', '#!/trend',     'See trends',    'line-chart', true),
          createAnchor('data',  '#!/data',      'Manage data',   'cog'),
          createAnchor('help',  '#!/help',      'Help',          'question-circle')
        );
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

      onBodyClick = function onBodyClick() {
        $rootScope.$broadcast('bodyClick');
      },

      stepInterval = function stepInterval(step) {
        timeService.stepInterval(step);
      },

      isAnchorSelected = function isAnchorSelected(anchor) {
        var
          path = '#!' + $location.path();

        return anchor.href === path;
      },

      isAnchorIntervalRelated = function isAnchorIntervalRelated() {
        return isAnchorSelected(leftAnchors[1]) || isAnchorSelected(leftAnchors[2]);
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

        ctrl.emptyDebug       = emptyDebug;
        ctrl.leftAnchors      = leftAnchors;
        ctrl.isAnchorSelected = isAnchorSelected ;
        ctrl.onBodyClick      = onBodyClick;
        ctrl.rightAnchors     = rightAnchors;
        ctrl.stepInterval     = stepInterval;

        //
        // $window.d = debugService;
        //
      };

    init();
  }]);
});
