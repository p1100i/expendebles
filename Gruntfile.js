module.exports = function runGrunt(grunt) {
  var
    pkg = grunt.file.readJSON('package.json'),

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
        'bower' : {
          'install' : {
            'options' : {
              'copy' : false
            }
          }
        },

        'browserify' : {
          'target' : {
            'files': [
              {
                'expand'  : true,
                'src'     : 'client-bootstrap.js',
                'dest'    : 'build/precompiled/js'
              }
            ]
          }
        },

        'clean' : {
          'coverage' : 'test/coverage',

          'precompiled' : 'build/precompiled',
          'compiled'    : 'build/compiled',
          'minified'    : 'build/minified'
        },

        'concat' : {
          'options': {
            'separator': ';'
          },

          'compiled' : {
            'files': {
              'build/compiled/js/bootstrap.js' : ['bower_components/requirejs/require.js', 'build/precompiled/js/template.js', 'build/precompiled/js/client-bootstrap.js']
            }
          }
        },

        'copy' : {
          'asset_compiled' : {
            'expand'  : true,
            'cwd'     : 'asset/',
            'src'     : '**/*',
            'dest'    : 'build/compiled/'
          },

          'asset_minified' : {
            'expand'  : true,
            'cwd'     : 'asset/',
            'src'     : '**/*',
            'dest'    : 'build/minified/'
          },

          'view' : {
            'expand'  : true,
            'cwd'     : 'src/html/view',
            'src'     : '**/*',
            'dest'    : 'build/compiled'
          },

          'js_lib_client' : {
            'expand'  : true,
            'cwd'     : 'bower_components',
            'src'     : '**/*',
            'dest'    : 'build/compiled/js/lib'
          },

          'js_src_client' : {
            'expand'  : true,
            'cwd'     : 'src/js/client',
            'src'     : '**/*',
            'dest'    : 'build/compiled/js/client'
          }
        },

        'cssmin' : {
          'options': {
            'shorthandCompacting': false,
            'roundingPrecision': -1
          },

          'minified': {
            'files': [
              {
                'src'   : 'build/compiled/css/app.css',
                'dest'  : 'build/minified/css/app.css'
              }
            ]
          }
        },

        'env' : {
          'coverage': {
            'SRC_COVERAGE'    : '../test/coverage/node/instrument/src/js/node',
            'KARMA_COVERAGE'  : true
          }
        },

        'gh-pages' : {
          'options': {
            'base': 'build/minified',
            'user': {
              'name': '<%= pkg.author.name %>',
              'email': '<%= pkg.author.email %>'
            }
          },

          'src': ['**/*']
        },

        'htmlmin' : {
          'minified': {
            'options': {
              'removeComments'      : true,
              'collapseWhitespace'  : true
            },

            'files': [
              {
                'expand'  : true,
                'src'     : ['*.html'],
                'cwd'     : 'build/compiled',
                'dest'    : 'build/minified'
              }
            ]
          }
        },

        'instrument' : {
          'files' : 'src/js/node/**/*.js',

          'options' : {
            'lazy'      : true,
            'basePath'  : 'test/coverage/node/instrument'
          }
        },

        'jasmine-node' : {
          'options' : {
            'spec_files'  : ['test/spec/node/**/*.spec.js'],
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
              'define'    : false,
              'requirejs' : false,
              'inject'    : false
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

          'minified': {
            'src'   : 'build/minified/**/*',
            'dest'  : 'build/minified'
          }
        },

        'ngtemplates' : {
          'default' : {
            'cwd'         : 'src/html/template',
            'src'         : '**/*.html',
            'dest'        : 'build/precompiled/js/template.js',
            'options'     : {
              'bootstrap': function (module, script) {
                // This predefines a function which will populate the angular
                // cache with the template HTML. Check out the generated
                // template.js under the build directory, you'll need to call
                // it with your angular app instance.
                return 'window.angularTemplates = function angularTemplates(app) { app.run([\'$templateCache\', function ($templateCache) { ' + script + ' } ]) };';
              },

              // Reference existing task.
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

        'replace' : {
          'coverage_client': {
            'options': {
              'patterns': [{
                'match'       : /\/[^"]*build\/compiled/g,
                'replacement' : 'src'
              }]
            },

            'files': [{
              'src'   : ['test/coverage/client/json/coverage.json'],
              'dest'  : 'test/coverage/client/json/coverage.json'
            }]
          }
        },

        'requirejs' : {
          'minified' : {
            'options': {
              'baseUrl'         : 'build/compiled/js/client',
              'mainConfigFile'  : 'client-bootstrap.js',
              'include'         : ['../bootstrap.js'],
              'out'             : 'build/minified/js/bootstrap.js'
            }
          }
        },

        'storeCoverage' : {
          'options' : {
            'include-all-sources' : true,
            'dir'                 : 'test/coverage/node/json'
          }
        },

        'stylus' : {
          'options' : {
            // Use import statements on css as copy inclusion.
            'include css' : true,
            'compress'    : false
          },

          'compiled' : {
            'files': [
              {
                'src'     : 'src/styl/main.styl',
                'dest'    : 'build/compiled/css/app.css'
              }
            ]
          }
        },

        'symlinkassets' : {
          'minified': {
            'root'  : 'minified',
            'src'   : 'build/minified/**/*',
            'dest'  : 'build/minified'
          }
        },

        'watch' : {
          'options' : {
            'spawn' : false
          },

          'asset' : {
            'files' : ['asset/**/*'],
            'tasks' : ['copy:asset_compiled', 'copy:asset_minified']
          },

          'bootstrap' : {
            'files' : ['client-bootstrap.js'],
            'tasks' : ['test:core', 'browserify', 'concat:compiled', 'test:client']
          },

          'client' : {
            'files' : ['src/js/client/**/*.js', 'test/spec/client/**/*.js'],
            'tasks' : ['test:core', 'copy:js_src_client', 'test:client']
          },

          'html' : {
            'files' : ['src/html/**/*.html'],
            'tasks' : ['ngtemplates', 'concat:compiled', 'copy:view']
          },

          'styl' : {
            'files' : ['src/styl/**/*'],
            'tasks' : ['stylus:compiled']
          }
        }
      };
    },

    TASKS = {
      'coverage' : [
        'clean:coverage',
        'env:coverage',
        'instrument',
        'jasmine-node',
        'storeCoverage',
        'karma',
        'replace:coverage_client',
        'makeReport'
      ],

      'test:core' : [
        'jshint:default',
        'jasmine-node'
      ],

      'test:style' : [
        'jshint:strict',
        'jscs'
      ],

      'test:client' : [
        'karma'
      ],

      'compile' : [
        'clean:precompiled',
        'clean:compiled',
        'browserify',
        'ngtemplates',
        'concat:compiled',
        'stylus:compiled',
        'copy:js_src_client',
        'copy:js_lib_client',
        'copy:view',
        'copy:asset_compiled'
      ],

      'minify' : [
        'clean:minified',
        'htmlmin:minified',
        'cssmin:minified',
        'copy:asset_minified',
        'requirejs'
      ],

      'md5' : [
        'md5symlink',
        'symlinkassets'
      ],

      'build:dev' : [
        'test:core',
        'compile',
        'test:client'
      ],

      'build' : [
        'compile',
        'minify',
        'md5'
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
        'bower',
        'build',
        'gh-pages'
      ],

      'default' : [
        'bower',
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

      grunt.loadNpmTasks('grunt-contrib-concat');
      grunt.loadNpmTasks('grunt-contrib-clean');
      grunt.loadNpmTasks('grunt-contrib-jshint');
      grunt.loadNpmTasks('grunt-contrib-watch');
      grunt.loadNpmTasks('grunt-jscs');
      grunt.loadNpmTasks('grunt-notify');
      grunt.loadNpmTasks('grunt-istanbul');
      grunt.loadNpmTasks('grunt-env');
      grunt.loadNpmTasks('grunt-angular-templates');
      grunt.loadNpmTasks('grunt-bower-task');
      grunt.loadNpmTasks('grunt-browserify');
      grunt.loadNpmTasks('grunt-contrib-jasmine-node');
      grunt.loadNpmTasks('grunt-contrib-copy');
      grunt.loadNpmTasks('grunt-contrib-cssmin');
      grunt.loadNpmTasks('grunt-contrib-htmlmin');
      grunt.loadNpmTasks('grunt-contrib-requirejs');
      grunt.loadNpmTasks('grunt-contrib-stylus');
      grunt.loadNpmTasks('grunt-gh-pages');
      grunt.loadNpmTasks('grunt-karma');
      grunt.loadNpmTasks('grunt-md5symlink');
      grunt.loadNpmTasks('grunt-replace');
      grunt.loadNpmTasks('grunt-symlinkassets');

      // Run notification hooks: notify about successful run also.
      grunt.task.run('notify_hooks');

      registerTasks(TASKS);
    };

  init();
};
