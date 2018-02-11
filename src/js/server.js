var
  // Require necessary npm modules.
  path          = require('path'),
  chalk         = require('chalk'),
  http          = require('http'),
  nodeStatic    = require('node-static'),
  yargs         = require('yargs'),

  // Chalks for logging.
  title         = chalk.bgBlack.white,
  important     = chalk.bgGreen.white,
  comment       = chalk.blue,
  error         = chalk.red,
  processEnv    = process.env,
  nodeEnv       = processEnv.NODE_ENV,

  // Pretty date stamp.
  date          = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),

  arrow = function arrow(str, style) {
    var
      rightLength = 14 - str.length;

    style = style || comment;

    return style('=== ' + str + ' ' + Array(rightLength).join('=') + '>');
  },

  serveFn = function serveFn(argv) {
    var
      mainServer,
      staticServer,
      staticServerDir,
      staticServerTarget,
      staticServerHandler,
      serverPort          = argv.port,
      staticServerOptions = {};

    console.log(arrow('server', title), title(date + ' UTC'));

    // If there is no env, then use development.
    if (!processEnv.NODE_ENV) {
      nodeEnv = processEnv.NODE_ENV = 'development';
    }

    if (nodeEnv === 'production') {
      staticServerDir = 'production';
    } else {
      staticServerDir = 'development';
      staticServerOptions.cache = 1;
    }

    //
    // Create a server for static files.
    //
    staticServerTarget  = path.join(__dirname, '..', '..', 'build', staticServerDir);
    staticServer        = new nodeStatic.Server(staticServerTarget, staticServerOptions);

    staticServerHandler = function staticServerHandler(req,  res) {
      staticServer.serve(req, res);

      console.log(arrow('Request'), important(req.url));
    };

    //
    // Instantiate an http server.
    //
    mainServer = http.createServer();
    mainServer.addListener('request', staticServerHandler);

    console.log(arrow('NodeStatic'), important(staticServerTarget));

    mainServer.on('listening', function () {
      console.log(arrow('Server'), important('listening on', serverPort));
    });

    mainServer.on('error',function (e) {
      console.error(arrow('Server', error), important(e));
    });

    mainServer.listen(serverPort);

    console.error(arrow('Server'), important('started on', serverPort));
  },

  usage = '$0 <cmd> [args]',

  serveOptions = function serveOptions(yargs) {
    yargs.option('p', {
      'alias'     : 'port',
      'describe'  : 'port to bind on',
      'type'      : 'number',
      'default'   : 3000
    });
  },

  serve = {
    'command'     : 'serve',
    'description' : 'start server',
    'fn'          : serveFn,
    'options'     : serveOptions
  };

yargs
  .usage(usage)
  .command(serve.command, serve.description, serve.options, serve.fn)
  .alias('h', 'help')
  .showHelpOnFail(true)
  .demandCommand(1, 1, '')
  .parse();
