module.exports = function runGrunt(grunt) {
  var
    pkg = grunt.file.readJSON('package.json'),

    path          = require('path'),
    childProcess  = require('child_process'),

    getCommit = function getCommit() {
      return childProcess.spawnSync('git', ['rev-parse', '--short', 'HEAD']).stdout.toString().trim();
    },

    createLibCopyObject = function createLibCopyObject(dirs) {
      var
        src   = dirs.slice(),
        dest  = [dirs[dirs.length - 1]];

      src.unshift('node_modules');
      dest.unshift('build', 'development', 'js', 'lib');

      src   = path.join.apply(null, src);
      dest  = path.join.apply(null, dest);

      return {
        'src'   : src,
        'dest'  : dest
      };
    },

    registerTask = function registerTask(taskName, task) {
      grunt.registerTask(taskName, task);
    },

    registerTasks = function registerTasks(tasks) {
      var
        taskName;

      for (taskName in tasks) {
        registerTask(taskName, tasks[taskName]);
      }
    },

    getTaskConfig = function getTaskConfig() {
      return {
        'browserify' : {
          'build/tmp/js/client.js' : 'src/js/client.js'
        },

        'clean' : {
          'coverage' : 'test/coverage',

          'tmp'         : 'build/tmp',
          'development' : 'build/development',
          'production'  : 'build/production'
        },

        'concat' : {
          'options': {
            'separator': ';'
          },

          'build/development/js/bundle.js' : [
            'node_modules/requirejs/require.js',
            'build/tmp/js/template.js',
            'build/tmp/js/client.js'
          ],

          'build/production/js/bundle.js' : [
            'node_modules/requirejs/require.js',
            'build/tmp/js/template.js',
            'build/tmp/js/client.js'
          ]
        },

        'copy' : {
          'asset' : {
            'files' : [
              {
                'expand'  : true,
                'cwd'     : 'asset/',
                'src'     : '**/*',
                'dest'    : 'build/development/'
              },

              {
                'expand'  : true,
                'cwd'     : 'asset/',
                'src'     : '**/*',
                'dest'    : 'build/production/'
              }
            ]
          },

          'fa' : {
            'files' : [
              {
                'expand'  : true,
                'cwd'     : 'node_modules/font-awesome/fonts',
                'src'     : '*',
                'dest'    : 'build/development/fonts'
              },

              {
                'expand'  : true,
                'cwd'     : 'node_modules/font-awesome/fonts',
                'src'     : '*',
                'dest'    : 'build/production/fonts'
              }
            ]
          },

          'view' : {
            'expand'  : true,
            'cwd'     : 'src/html/view',
            'src'     : '**/*',
            'dest'    : 'build/development'
          },

          'lib' : {
            'files' : [
              createLibCopyObject(['angular',               'angular.js']),
              createLibCopyObject(['angular-local-storage', 'dist', 'angular-local-storage.js']),
              createLibCopyObject(['angular-mocks',         'angular-mocks.js']),
              createLibCopyObject(['angular-route',         'angular-route.js']),
              createLibCopyObject(['lz-string',             'libs', 'lz-string.js'])
            ]
          },

          'rmodule' : {
            'expand'  : true,
            'cwd'     : 'src/js/rmodule',
            'src'     : '**/*',
            'dest'    : 'build/development/js/rmodule'
          }
        },

        'cssmin' : {
          'options': {
            'shorthandCompacting': false,
            'roundingPrecision': -1
          },

          'build/production/css/app.css' : 'build/development/css/app.css'
        },

        'ejs' : {
          'build' : {
            'options': {
              'date'        : Date.now(),
              'commit'      : getCommit(),
              'description' : pkg.description,
              'name'        : pkg.name,
              'version'     : pkg.version
            },

            'src'   : ['src/ejs/build.ejs'],
            'dest'  : 'src/js/dimodule/build.js'
          }
        },

        'env' : {
          'coverage': {
            'SRC_COVERAGE'    : '../test/coverage/dimodule/instrument/src/js',
            'KARMA_COVERAGE'  : true
          }
        },

        'gh-pages' : {
          'options': {
            'base': 'build/production',
            'user': {
              'name': '<%= pkg.author.name %>',
              'email': '<%= pkg.author.email %>'
            }
          },

          'src': ['**/*']
        },

        'htmlmin' : {
          'options': {
            'removeComments'      : true,
            'collapseWhitespace'  : true
          },

          'production': {
            'expand'  : true,
            'src'     : ['*.html'],
            'cwd'     : 'src/html/view',
            'dest'    : 'build/production'
          }
        },

        'instrument' : {
          'files' : 'src/js/dimodule/**/*.js',

          'options' : {
            'lazy'      : true,
            'basePath'  : 'test/coverage/dimodule/instrument'
          }
        },

        'jasmine-node' : {
          'options' : {
            'spec_files'  : ['test/spec/dimodule/**/*.spec.js'],
            'random'      : true
          }
        },

        'jscs' : {
          'options' : {
            'disallowTrailingWhitespace'            : true,
            'disallowTrailingComma'                 : true,
            'disallowFunctionDeclarations'          : true,
            'disallowNewlineBeforeBlockStatements'  : true,
            'disallowMixedSpacesAndTabs'            : true,
            'requireDotNotation'                    : true,
            'requireMultipleVarDecl'                : true,
            'requireSpaceAfterKeywords'             : true,
            'requireSpaceBeforeBlockStatements'     : true,
            'requireSpacesInConditionalExpression'  : true,
            'requireCurlyBraces'                    : true,
            'disallowKeywordsOnNewLine'             : ['else'],
            'validateIndentation'                   : 2,
            'requireSpacesInFunction' : {
              'beforeOpeningCurlyBrace' : true
            }
          },

          'default' : ['*.js', 'config', 'src', 'test/spec']
        },

        'jshint' : {
          'options': {
            'globals'     : {
              'browser'     : false,
              'by'          : false,
              'define'      : false,
              'element'     : false,
              'inject'      : false,
              'protractor'  : false,
              'requirejs'   : false
            },

            'jasmine'     : true,
            'browser'     : true,
            'curly'       : true,
            'eqeqeq'      : true,
            'eqnull'      : true,
            'latedef'     : true,
            'newcap'      : true,
            'node'        : true,
            'nonew'       : true,
            'nonbsp'      : true,
            'quotmark'    : 'single',
            'undef'       : true,
            'debug'       : true,
            'indent'      : 2
          },

          'default' : ['*.js', 'config', 'src', 'test/spec'],

          'strict' : {
            'options' : {
              'noempty' : true,
              'unused'  : 'vars'
            },

            'files' : {
              'src' : ['*.js', 'config', 'src', 'test/spec']
            }
          }
        },

        'karma' : {
          'unit' : {
            'configFile' : 'test/karma.conf.js'
          }
        },

        'makeReport' : {
          'src' : 'test/coverage/**/*.json',

          'options' : {
            'type'  : 'html',
            'dir'   : 'test/coverage/html',
            'print' : 'detail'
          }
        },

        'md5symlink' : {
          'options' : {
            'patterns' : ['.js', '.css']
          },

          'development': {
            //
            // Note: build/development contains lots of other directories.
            //
            'src'   : ['build/development/css/*', 'build/development/js/*'],
            'dest'  : 'build/development'
          },

          'production': {
            'src'   : 'build/production/**/*',
            'dest'  : 'build/production'
          }
        },

        'ngtemplates' : {
          'default' : {
            'cwd'         : 'src/html/template',
            'src'         : '**/*.html',
            'dest'        : 'build/tmp/js/template.js',
            'options'     : {
              'bootstrap': function (module, script) {
                //
                // This predefines a function which will populate the angular
                // cache with the template HTML. Check out the generated
                // template.js under the build directory, you'll need to call
                // it with your angular app instance.
                //
                return 'window.angularTemplates = function angularTemplates(app) { app.run([\'$templateCache\', function ($templateCache) { ' + script + ' } ]) };';
              },

              //
              // Reference existing task.
              //
              'htmlmin' : {
                'collapseWhitespace'        : true,
                'collapseBooleanAttributes' : true
              }
            }
          }
        },

        'notify_hooks' : {
          'options' : {
            'success' : true
          }
        },

        'protractor' : {
          'options' : {
            //
            // This can be disabled after the first run.
            //
            'webdriverManagerUpdate' : true,

            'keepAlive' : true
          },

          'default' : {
            'configFile'  : 'test/protractor.conf.js'
          }
        },

        'replace' : {

          'coverage_rmodule': {
            'options': {
              'patterns': [{
                'match'       : /\/[^"]*build\/development/g,
                'replacement' : 'src'
              }]
            },

            'files': [{
              'src'   : ['test/coverage/rmodule/json/coverage.json'],
              'dest'  : 'test/coverage/rmodule/json/coverage.json'
            }]
          }
        },

        'requirejs' : {
          'production' : {
            'options': {
              'baseUrl'         : 'build/development/js/rmodule',
              //
              // src file is used only as configuration, it is only parsed
              // by requireJS to know what to include. The file which is the
              // source of minification is defined in the `include` property.
              //
              'mainConfigFile'  : 'src/js/client.js',
              'include'         : ['../../../production/js/bundle.js'],
              'out'             : 'build/production/js/bundle.js',

              'uglify2' : {
                'compress' : {
                  'dead_code' : true,

                  //
                  // Put code in your app in a condition
                  // if (DEBUG) ... it will be never built
                  // into the production, however you can
                  // leave it there for development purpose.
                  //
                  'global_defs': {
                    'DEBUG' : false
                  }
                }
              }
            }
          }
        },

        'storeCoverage' : {
          'options' : {
            'include-all-sources' : true,
            'dir'                 : 'test/coverage/dimodule/json'
          }
        },

        'stylus' : {
          'options' : {
            //
            // Use import statements on css as copy inclusion.
            //
            'include css' : true,
            'compress'    : false
          },

          'build/development/css/app.css' : 'src/styl/main.styl'
        },

        'symlinkassets' : {
          'development': {
            'root'  : 'development',
            'src'   : 'build/development/**/*',
            'dest'  : 'build/development'
          },

          'production': {
            'root'  : 'production',
            'src'   : 'build/production/**/*',
            'dest'  : 'build/production'
          }
        },

        'watch' : {
          //
          // Turning off 'spawn' option can speed up the watch execution, however
          // some grunt-task do not play well by having executed multiple times
          // in the same process (e.g. jasmine-node)
          //
          // 'options' : {
          //   'spawn' : false
          // },
          //

          'asset' : {
            'files' : ['asset/**/*'],
            'tasks' : ['copy:asset']
          },

          'bundle' : {
            'files' : ['src/js/client.js', 'src/js/dimodule/**/*.js', 'test/spec/dimodule/**/*.js'],
            'tasks' : ['test:core', 'browserify', 'replace:build', 'concat', 'md5:development', 'test:client']
          },

          'rmodule' : {
            'files' : ['src/js/rmodule/**/*.js', 'test/spec/rmodule/**/*.js'],
            'tasks' : ['test:core', 'copy:rmodule', 'test:client']
          },

          'html' : {
            'files' : ['src/html/**/*.html'],
            'tasks' : ['ngtemplates', 'concat', 'copy:view', 'md5:development']
          },

          'styl' : {
            'files' : ['src/styl/**/*'],
            'tasks' : ['stylus', 'md5:development']
          }
        }
      };
    },

    TASKS = {
      'coverage' : [
        'clean:coverage',
        'env:coverage',
        // 'instrument',
        // 'jasmine-node',
        // 'storeCoverage',
        'karma',
        'replace:coverage_rmodule',
        'makeReport'
      ],

      'test:core' : [
        'jshint:default'
        // 'jasmine-node'
      ],

      'test:style' : [
        'jshint:strict',
        'jscs'
      ],

      'test:client' : [
        'karma'
      ],

      'test:e2e' : [
        'protractor'
      ],

      'md5:development' : [
        'md5symlink:development',
        'symlinkassets:development'
      ],

      'md5:production' : [
        'md5symlink:production',
        'symlinkassets:production'
      ],

      'compile' : [
        'clean:tmp',
        'clean:development',
        'ejs:build',
        'browserify',
        'ngtemplates',
        'concat',
        'stylus',
        'copy:fa',
        'copy:lib',
        'copy:rmodule',
        'copy:view',
        'copy:asset',
        'md5:development'
      ],

      'minify' : [
        'clean:production',
        'htmlmin',
        'cssmin',
        'copy:asset',
        'copy:fa',
        'concat',
        'requirejs',
        'md5:production'
      ],

      'build:dev' : [
        'test:core',
        'compile',
        'test:client'
      ],

      'build' : [
        'compile',
        'minify'
      ],

      'test' : [
        'test:core',
        'test:client',
        'test:style'
      ],

      'dev' : [
        'clean',
        'build:dev',
        'watch'
      ],

      'publish' : [
        'clean',
        'build',
        'gh-pages'
      ],

      'default' : [
        'test:style',
        'build',
        'coverage'
      ]
    },

    init = function init() {
      var
        taskConfig = getTaskConfig();

      taskConfig.pkg = pkg;

      grunt.initConfig(taskConfig);

      require('load-grunt-tasks')(grunt);

      // Run notification hooks: notify about successful run also.
      grunt.task.run('notify_hooks');

      registerTasks(TASKS);
    };

  init();
};
