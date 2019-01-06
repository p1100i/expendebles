process.env.CHROME_BIN='/usr/bin/chromium';

module.exports = function (config) {
  var
    options,
    coverage  = process.env.KARMA_COVERAGE === 'true',
    browser   = process.env.KARMA_BROWSER,

    reporters           = [],
    coverageReporters   = [];

  options = {
    'reporters'       : reporters,
    'basePath'        : '../build/development',
    'frameworks'      : ['jasmine', 'requirejs'],
    'colors'          : true,
    'logLevel'        : config.LOG_WARN, // config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    'autoWatch'       : false,
    'captureTimeout'  : 6000,
    'reportSlowerThan': 500,

    // The order matters, if something is matched with false `included` property,
    // later on a match with - included true - won't inject the script into the page.
    'files': [
      'js/bundle.js',
      { 'pattern' : 'js/**/*.js',                             'included': false },
      { 'pattern' : '../../test/spec/rmodule/**/*.spec.js',   'included': false }
    ],

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - ChromeHeadless
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    // - PhantomJS
    //
    //
    'browsers': [
      browser || 'ChromeHeadless'
      // 'Chrome' // Note: read below!
    ],

    //
    // You can run the tests in chrome by installing
    // 'npm install -g karma-chrome-launcher'
    // and by setting singleRun (see below) to false.
    //
    // Then, when executing runTest.sh a chrome/chromium will be launched,
    // click on debug, open a developer console and refresh a page.
    // After that you should land in debug mode, in the context of the
    // specific jasmine spec.
    //
    // Use this if you want to run the specs in a browser w/ UI.
    // Specs will be executed on every reload.
    // 'singleRun': false
    'singleRun': true
  };

  if (coverage) {
    coverageReporters.push({
      'type'    : 'json',
      'subdir'  : 'json',
      'file'    : 'coverage.json'
    });

    options.preprocessors = {
      'js/rmodule/**/*.js': 'coverage'
    };

    options.coverageReporter = {
      'dir'       : '../../test/coverage/rmodule',
      'reporters' : coverageReporters
    };

    reporters.push('coverage');
  } else {
    options.jasmineDiffReporter = {
      // pretty will make object compare identation w/ two spaces nesting level.
      'pretty' : true,

      // multiline will insert newlines between expected and actual values.
      'multiline' : true
    };

    options.mochaReporter = {
      // no point of showing verbose info about skipped tests
      'ignoreSkipped' : true

      // limit max log lines, avoiding long stack traces
      // 'maxLogLines' : 10
    };

    // Add jasmine-diff as reporter to see failing spec output more clearly.
    reporters.push('jasmine-diff', 'mocha');
  }

  config.set(options);
};
