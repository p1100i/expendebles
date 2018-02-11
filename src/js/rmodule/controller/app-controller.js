define(['app', 'di', 'socketIo'], function (app, di, socketIo) {
  app.controller('appController', ['$rootScope', '$location', '$window', 'settingService', function appControllerFactory($rootScope, $location, $window, settingService) {
    var
      app = this,

      //
      // Remove these line if you don't need socketIo connection.
      //
      // You can remove the SocketClient from di-client.js as well,
      // to avoid including it into the bundled code.
      //
      // Make sure to do this for di-server.js and server.js as well,
      // to avoid initialazing socketIo server.
      //
      SocketClient  = di.get('SocketClient'),
      socketClient  = new SocketClient(socketIo),

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
          createAnchor('help',  '#!/help', 'Help',  'question-circle')
        );

        rightAnchors.push(
          createAnchor('about', '#!/',     'About', 'home')
        );
      },

      isAnchorSelected = function isAnchorSelected(anchor) {
        var
          path = '#!' + $location.path();

        return anchor.href === path;
      },

      onFocused = function onFocused() {
        $rootScope.$broadcast('window:focus');
      },

      init = function init() {
        app.bodyClass         = settingService.get('bodyClass');
        app.isAnchorSelected  = isAnchorSelected ;
        app.leftAnchors       = leftAnchors;
        app.rightAnchors      = rightAnchors;

        $window.onfocus = onFocused;

        setMenu();

        //
        // An example of message sending in socketIo.
        //
        socketClient.emit('hello');

      };

    init();
  }]);
});
