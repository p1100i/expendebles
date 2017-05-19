describe('appController', function () {
  var test;

  beforeEach(function () {
    test = this;

    module('app');

    var
      settingService = {
        'get' : function () { return 'getValue'; }
      },

      spies = {
        'settingService' : {
          'get' : spyOn(settingService, 'get').and.callThrough()
        }
      },

      dependencies = {
        'settingService' : settingService
      };

    inject(['$controller', function ($controller) {
      test.ctrl = $controller('appController', dependencies);
    }]);

    this.spies = spies;
  });

  it('should call settingService.get()', function () {
    expect(this.spies.settingService.get).toHaveBeenCalledWith('bodyClass');
  });

  it('should set bodyclass', function () {
    expect(this.ctrl.bodyClass).toBe('getValue');
  });
});
