define(['app'], function (app) {
  app.controller('helpController', [function HelpControllerFactory() {
    var
      ctrl = this,

      getSolarizedColorSets = function getSolarizedColorSets() {
        var
          i,
          j,
          set,
          sets = [];

        for (i = 0; i < 4; i++) {
          set = [];

          for (j = 0; j < 5; j++) {
            set.push('solarized-' + (i * 5 + j));
          }

          sets.push(set);
        }

        return sets;
      },

      getCustomColorSets = function getCustomColorSets() {
        return [
          ['navy', 'blue', 'aqua', 'teal', 'olive'],
          ['green', 'lime', 'yellow', 'gold', 'orange'],
          ['red', 'maroon', 'fuchsia', 'purple', 'white'],
          ['grey-white', 'grey-light', 'grey', 'grey-dark', 'grey-black']
        ];
      },

      init = function init() {
        ctrl.customColorSets    = getCustomColorSets();
        ctrl.solarizedColorSets = getSolarizedColorSets();
      };

    init();
  }]);
});
