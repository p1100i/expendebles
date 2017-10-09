describe('appController', function () {
  var test;

  beforeEach(function () {
    test = this;

    module('app');

    var
      spies         = {},
      dependencies  = {};

    inject(['$controller', function ($controller) {
      test.ctrl = $controller('appController', dependencies);
    }]);

    this.spies = spies;
  });

  it('should set anchors', function () {
    expect(this.ctrl.leftAnchors).toEqual(jasmine.any(Array));
    expect(this.ctrl.rightAnchors).toEqual(jasmine.any(Array));
  });
});
