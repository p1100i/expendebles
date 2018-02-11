var
  dependencies = {},

  spyOn,
  testing,

  test = function test(newSpyOn) {
    testing = true;
    spyOn   = newSpyOn;
  },

  setDependencyResult = function setDependencyResult(dependency, result) {
    return (dependency.result = result);
  },

  get = function get(name) {
    var
      i,
      subresults,
      dependency = dependencies[name];

    if (!testing && !dependency) {
      console.error('no such dependency:', name);
      throw new Error('invalid_key');
    }

    if (!dependency) {
      return {};
    }

    if (!testing && dependency.result) {
      return dependency.result;
    }

    if (dependency.type === 'factory') {
      subresults = [];

      for (i = 0; i < dependency.subdependencies.length; i++) {
        subresults.push(get(dependency.subdependencies[i]));
      }

      return setDependencyResult(dependency, dependency.injector.apply(null, subresults));
    }

    return setDependencyResult(dependency, dependency.value);
  },

  set = function set(name, subdependencies, injector) {
    if (!testing && dependencies[name]) {
      console.warn('dependency already registered, skipping');
      return;
    }

    if (injector) {
      dependencies[name] = {
        'subdependencies' : subdependencies,
        'injector'        : injector,
        'type'            : 'factory'
      };
    } else {
      dependencies[name] = {
        'value' : subdependencies
      };
    }
  },

  spy = function spy() {
    var
      prop,
      Original,
      spy,
      spies,
      fake,
      fakes,
      args      = Array.prototype.slice.call(arguments),
      name      = args.shift(),
      spyName   = name,
      test      = get('test'),
      original  = get(name),
      factory   = typeof (original) === 'function',
      mock      = {};

    if (!test) {
      console.error('test not set');
      throw new Error('test_no_set');
    }

    spies = test.spies;

    if (!spies) {
      spies = test.spies = {};
    }

    if (factory) {
      args.unshift(null);

      spyName   = name.charAt(0).toLowerCase() + name.slice(1);
      Original  = Function.prototype.bind.apply(original, args);
      original  = new Original();
    } else {
      fakes = args.shift();
    }

    spy = spies[spyName];

    if (!spy) {
      spy = spies[spyName] = {};
    }

    for (prop in original) {
      fake        = fakes && fakes[prop];
      mock[prop]  = fake || function () {};
      spy[prop]   = mock[prop] = spyOn(mock, prop).and.callThrough();
    }

    if (factory) {
      set(name, function () {
        return mock;
      });
    } else {
      set(name, mock);
    }
  },

  di = {
    'get'   : get,
    'set'   : set,
    'spy'   : spy,
    'test'  : test
  };

module.exports = di;
