describe('storageService', function () {
  var test;

  beforeEach(function () {
    test = this;

    module('app');

    inject(['storageService', function (storageService) {
      test.service = storageService;
    }]);
  });

  describe('.get()', function () {
    describe('with a property not set', function () {
      it('should return undefined', function () {
        expect(this.service.get('another')).toEqual(null);
      });
    });

    describe('with finance (a property w/ default value)', function () {
      it('should return the default value', function () {
        expect(this.service.get('transactions')).toEqual([]);
      });

      it('should return the default value', function () {
        expect(this.service.get('balances')).toEqual([]);
      });

      describe('with a set on that property', function () {
        beforeEach(function () {
          this.service.set('finance', 'x');
        });

        it('should return the newly set value', function () {
          expect(this.service.get('finance')).toBe('x');
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
