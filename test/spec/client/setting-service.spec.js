describe('settingService', function () {
  var test;

  beforeEach(function () {
    test = this;

    module('app');

    inject(['settingService', function (settingService) {
      test.service = settingService;
    }]);
  });

  describe('.get()', function () {
    describe('with a property not set', function () {
      it('should return undefined', function () {
        expect(this.service.get('something')).toBe(undefined);
      });
    });

    describe('with a property having default value', function () {
      it('should return the default value', function () {
        expect(this.service.get('bodyClass')).toBe('simple');
      });

      describe('with a set on that property', function () {
        beforeEach(function () {
          this.service.set('bodyClass', 'complex');
        });

        it('should return the newly set value', function () {
          expect(this.service.get('bodyClass')).toBe('complex');
        });
      });
    });

    describe('with set on the property', function () {
      beforeEach(function () {
        this.service.set('something', 'similar');
      });

      it('should return the set value', function () {
        expect(this.service.get('something')).toBe('similar');
      });
    });
  });

  describe('.set()', function () {
    it('should not throw', function () {
      expect(this.service.set.bind(null, 'someone')).not.toThrow();
    });
  });
});
