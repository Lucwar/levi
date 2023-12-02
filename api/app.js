import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import routes from './routes';
import multipart from 'connect-multiparty';
import http from 'http';
import https from 'https';
import fs from 'fs';
import settings from './config/settings';

global.translations = require('./config/translations');

const app = express();

const HTTPS_CERTS = {
  cert: settings.production ? fs.readFileSync(process.env.HTTPS_CERTIFICATE) : null,
  ca: settings.production ? fs.readFileSync(process.env.HTTPS_CA_BUNDLE) : null,
  key: settings.production ? fs.readFileSync(process.env.HTTPS_PRIVATE_KEY) : null
};

// -------------------------- Server HTTP -------------------------- //

const serverHTTP = http.createServer(app);

// -------------------------- Server HTTP -------------------------- //

// -------------------------- Server HTTPS -------------------------- //

const serverHTTPS = https.createServer(HTTPS_CERTS, app);

// -------------------------- Server HTTPS -------------------------- //

// -------------------------- Peer Server -------------------------- //

// const peer_server = https.createServer(HTTPS_CERTS, app);

// peer_server.listen(settings.portPeer);

// const expressPeerServer = require('peer').ExpressPeerServer(peer_server);
// app.use('/peerjs', expressPeerServer);

// expressPeerServer.on('connection', client => console.log('PeerJS connected: ', client.id));
// expressPeerServer.on('disconnect', client => console.log('PeerJS disconnected: ', client.id));

// -------------------------- Peer Server -------------------------- //

// -------------------------- Garbage Collector -------------------------- //

if (global.gc) setInterval(() => global.gc(), 30000);

// Define HttpError class
class HttpError extends Error {
  constructor(message, status) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Define DbError class
class DbError extends Error {
  constructor(message, code) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

// (+) LIBRARIES

const lib = {
  fs,
  httpError: (status, message) => {
    const result = new Error(message);

    result.status = status || 400;

    return result;
  },

  dbError: (code, message) => {
    const result = new Error(message);

    result.code = code || -1000;

    return result;
  },

  utils: {
    // Method to normalize file name (the-name -> theName)
    normalizeFileName: value =>
      value
        .replace(/\.js$/, '')
        .replace(/\./g, ' ')
        .replace(/_/g, ' ')
        .replace(/\W+(.)/g, (match, chr) => chr.toUpperCase())
  },

  mongodb: {
    mongoose: require('mongoose'),
    plugins: [require('mongoose-unique-validator'), require('@meanie/mongoose-to-json')]
  },

  bcrypt: require('bcrypt'),
  bouncer: {
    smsResend: require('express-bouncer')(60 * 1000, 3 * 60 * 1000, 1),
    bruteForce: require('express-bouncer')(1 * 1000, 10 * 60 * 1000, 2),
    duplicates: require('express-bouncer')(3 * 1000, 60 * 1000, 1),
  },
  cors: require('cors'),
  cron: require('node-cron'),
  crypto: require('crypto'),
  csv: require('csvtojson'),
  eventEmitter: new (require('events').EventEmitter)(),
  exphbs: require('express-handlebars'),
  helmet: require('helmet'),
  hpp: require('hpp'),
  jsonwebtoken: require('jsonwebtoken'),
  logger: require('./config/logger').logger,
  moment: require('moment'),
  nodemailer: require('nodemailer'),
  responseHooks: require('express-response-hooks'),
  socketio: require('socket.io'),
  toobusy: require('toobusy-js'),
  trae: require('trae'),
  url: require('url'),
  uuid: require('uuid'),
  // androidpublisher: null
};

// Configura el cliente de la API google (npm i googleapis)
// try {
//   const {google} = require('googleapis');
//   lib.androidpublisher = google.androidpublisher({
//     version: 'v3',
//     auth: process.env.IAP_GOOGLE_KEY
//   });
// }
// catch(e) {
//   console.log('googleapis err: ', e)
// }

// (-) LIBRARIES


// -------------------------- Handle Bars -------------------------- //

app.engine('handlebars', lib.exphbs());
app.set('view engine', 'handlebars');

// -------------------------- Handle Bars -------------------------- //


app.use((req, res, next) => {
  req.settings = require('./config/settings');
  return next();
});


// cache control error 304
app.disable('etag');

// CORS
app.use(lib.cors(settings.cors));

app.use(multipart({ uploadDir: settings.uploadDir }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ parameterLimit: 100000, limit: '50mb', extended: true }));

app.use(cookieParser());


// Prevent HTTP Parameter Pollution
app.use(lib.hpp());


// Configure HTTP Headers
app.use(lib.helmet({
  crossOriginResourcePolicy: false,
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));

app.set('trust proxy', 1);


// Configure bouncers
lib.bouncer.bruteForce.blocked = (req, res, next, remaining) =>
  res.status(429).send({ message: `Demasiadas peticiones, por favor, inténtelo de nuevo en ${remaining / 1000} segundos.` });

lib.bouncer.duplicates.blocked = (req, res, next, remaining) =>
  res.status(429).send({ message: `Ya has realizado esta solicitud.` });

lib.bouncer.smsResend.blocked = (req, res, next, remaining) =>
  res.status(429).send({ message: `Ya has reenviado el código, por favor, inténtelo de nuevo en ${Math.floor(remaining / 1000)} segundos.` });


// Configure response hooks
app.use(lib.responseHooks());

app.use((req, res, next) => {
  res.hooks.on('send', args => lib.bouncer.duplicates.reset(req));
  next();
});



// Prevent event loop blocking
// app.use('/api', (req, res, next) => {
//   if (lib.toobusy()) {
//     log({ level: 'error', message: 'server-too-busy' }, {}, req);
//     res.status(503).send({ message: 'Server too busy' });
//   } else next();
// });


// Validate content-type is accepted
app.use('/api', (req, res, next) =>
  ['POST', 'PUT'].includes(req.method) && !(req.is('application/json') || req.is('multipart/form-data'))
    ? res.status(406).send({ message: 'Content-Type not accepted' })
    : next()
);


// Check duplicated requests
app.use('/api', (req, res, next) =>
  ['POST', 'PUT', 'DELETE'].includes(req.method) && !req.path.includes('/refreshToken')
    ? lib.bouncer.duplicates.block(req, res, next)
    : next()
);


// (+) DATABASE

global.database = {};
global.database.mongodb = lib.mongodb;

// (-) DATABASE

// (+) UTILS
global.utils = {

};
// (-) UTILS

// (+) HELPERS

// Define helpers
let helpersLoad = {};
let helpersPath = __dirname + '/helpers';
lib.fs.readdirSync(helpersPath).forEach(helperCode => {
  let helperName = lib.utils.normalizeFileName(helperCode);
  let helperPath = helpersPath + '/' + helperCode;
  lib.fs.readdirSync(helperPath).forEach(helperFile => {
    if (helperFile.match(/\.js$/)) {
      let methodName = lib.utils.normalizeFileName(helperFile);
      helpersLoad[helperName] = helpersLoad[helperName] || {};
      helpersLoad[helperName][methodName] = require(helperPath + '/' + helperFile);
    }
  });
});

// Verify helpers
global.helpers = {};
for (let h in helpersLoad) {
  global.helpers[h] = {};
  global.helpers[h].settings = settings;
  // global.helpers[h].server = server;
  global.helpers[h].router = express.Router();
  global.helpers[h].app = app;
  // global.helpers[h].db = db;
  global.helpers[h].lib = lib;
  for (let f in helpersLoad[h]) {
    if (helpersLoad[h][f] && typeof helpersLoad[h][f] == 'function') {
      try {
        global.helpers[h][f] = helpersLoad[h][f](global.helpers[h]);
      } catch (error) {
        console.error('Helper "' + h + '.' + t + '" not loaded');
        console.error(error);
      }
    }
  }
}

global.log = global.helpers.logs.log;

// (-) HELPERS

// (+) MODULES

// Define modules
let modulesLoad = {};
let modulesPath = __dirname + '/modules';
lib.fs.readdirSync(modulesPath).forEach(version => {
  let modulesPathVersion = modulesPath + '/' + version;
  modulesLoad[version] = {};
  lib.fs.readdirSync(modulesPathVersion).forEach(moduleCode => {
    let moduleName = lib.utils.normalizeFileName(moduleCode);
    let modulePath = modulesPathVersion + '/' + moduleCode;
    lib.fs.readdirSync(modulePath).forEach(moduleFile => {
      if (moduleFile.match(/\.js$/)) {
        let methodName = lib.utils.normalizeFileName(moduleFile);
        modulesLoad[version][moduleName] = modulesLoad[version][moduleName] || {};
        modulesLoad[version][moduleName][methodName] = require(modulePath + '/' + moduleFile);
      }
    });
  });
  console.info('Version "' + version + '" loaded');
});

let modulesVersions = [];
let dbModels = {};

// Verify modules
global.modules = {};
for (let v in modulesLoad) {
  modulesVersions.push(v);
  global.modules[v] = {};
  for (let m in modulesLoad[v]) {
    global.modules[v][m] = {};
    global.modules[v][m].settings = settings;
    // global.modules[m].server = server;
    global.modules[v][m].router = express.Router();
    global.modules[v][m].app = app;
    // global.modules[m].db = db;
    global.modules[v][m].lib = lib;
    for (let t in modulesLoad[v][m]) {
      if (modulesLoad[v][m][t] && typeof modulesLoad[v][m][t] == 'function') {
        try {
          modulesLoad[v][m][t](global.modules[v][m]);
          console.info('Module "' + v + '.' + m + '.' + t + '" loaded');
        } catch (error) {
          console.error('Module "' + v + '.' + m + '.' + t + '" not loaded');
          console.error(error);
        }
      }
    }
  }
}

modulesVersions.sort((a, b) => {
  const va = parseInt(a.replace('v', ''));
  const vb = parseInt(b.replace('v', ''));
  return vb - va;
});

// Build models
for (let v of modulesVersions) {
  for (let m in global.modules[v]) {
    if (!dbModels[m]) {
      if (global.modules[v][m].schema) {
        for (let p of global.database.mongodb.plugins) global.modules[v][m].schema.plugin(p);
        global.modules[v][m].model = global.database.mongodb.mongoose.model(m, global.modules[v][m].schema);
        dbModels[m] = { version: v, model: global.modules[v][m].model };
      }
    } else {
      global.modules[v][m].model = dbModels[m].model;
    }
  }
}

// Verify modules models events
for (let v of modulesVersions) {
  for (let m in global.modules[v]) {
    if (global.modules[v][m].model && global.modules[v][m].model.beforeExecuteLoad) {
      global.modules[v][m].model.beforeExecuteLoad();
    }
  }
}

// Define api routes
for (let v of modulesVersions) {
  for (let m in global.modules[v]) {
    if (global.modules[v][m].router) {
      app.use('/api/' + v + '/' + m + '/', global.modules[v][m].router);
    }
  }
}
// (-) MODULES

// (+) CRONS

// Define crons
let cronsLoad = {};
let cronsPath = __dirname + '/crons';
lib.fs.readdirSync(cronsPath).forEach(cronCode => {
  let cronName = lib.utils.normalizeFileName(cronCode);
  let cronPath = cronsPath + '/' + cronCode;
  lib.fs.readdirSync(cronPath).forEach(cronFile => {
    if (cronFile.match(/\.js$/)) {
      let methodName = lib.utils.normalizeFileName(cronFile);
      cronsLoad[cronName] = cronsLoad[cronName] || {};
      cronsLoad[cronName][methodName] = require(cronPath + '/' + cronFile);
    }
  });
});

// Verify crons
global.crons = {};
for (let h in cronsLoad) {
  global.crons[h] = {};
  global.crons[h].settings = settings;
  global.crons[h].modules = global.modules;
  global.crons[h].helpers = global.helpers;
  global.crons[h].lib = lib;
  for (let f in cronsLoad[h]) {
    if (cronsLoad[h][f] && typeof cronsLoad[h][f] == 'function') {
      try {
        global.crons[h][f] = {};
        global.crons[h][f].name = `${h}.${f}`;
        global.crons[h][f].function = cronsLoad[h][f](global.crons[h], global.crons[h][f].name);
        global.crons[h][f].task = lib.cron.schedule(global.crons[h].period, global.crons[h][f].function, {
          scheduled: global.crons[h].enabled
        });
      } catch (error) {
        console.error('Cron "' + h + '.' + f + '" not loaded');
        console.error(error);
      }
    }
  }
}

// (-) CRONS

// (+) SOCKET IO

const io = new lib.socketio.Server(settings.production ? serverHTTPS : serverHTTP, {
  allowEIO3: true,
  cors: {
    origin: settings.cors.origin,
    credentials: true,
  },
});

// io.use((socket, next) => {
//   const handshake = socket.request;
//   let decoded;


// });

io.on('connection', socket => global.helpers.sockets.socket(socket, io));

app.set('socketio', io);

global.io = io;

lib.eventEmitter.on('send-actions', async user => {
  const actionsToPerform = await global.modules.v1.actions.model
    .find({ user, performed: false })
    .catch(e => console.log(e));

  io.to(user.toString()).emit(
    'pendingActions',
    actionsToPerform,
    actionsToPerform.filter(action => action.performRequired)
  );
});

// (-) SOCKET IO

// Files Folders
for (const size of settings.files.sizes) {
  const dir = settings.files.path + '/' + size.code;

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/*
 * @static content
 * app.use('/speechToText', express.static(path.join(__dirname, './static/speechToText.html')));
 * app.use('/files', express.static(path.join(__dirname, './static/files/')));
 */
app.use('/api', routes);

app.get('/privacy-policies', (req, res) => {
  res.render('docs/privacy-policies', {});
});
app.get('/terms-conditions', (req, res) => {
  res.render('docs/terms-conditions', {});
});

app.use('/', express.static(path.join(__dirname, settings.rootBuildPath)));
if (settings.admBuildPath) app.use('/adm', express.static(path.join(__dirname, settings.admBuildPath)));

app.use('/files', express.static(path.join(__dirname, settings.files.path)));

app.get('/.well-known/assetlinks.json', (req, res) => res.sendFile('assetlink.json', { root: './.well-known' }));

app.get('/apple-app-site-association', (req, res) => res.sendFile('apple-app-site-association', { root: './.well-known' }));

app.get('/.well-known/apple-app-site-association', (req, res) => res.sendFile('apple-app-site-association', { root: './.well-known' }));

app.get('/assets/*', (req, res) => {

  if (req.headers.referer.includes('/adm')) {
    const splitPath = req.path.split('/');
    const file = splitPath.pop();
    const root = settings.admBuildPath + splitPath.filter(element => element).reduce((prev, current) => prev + '/' + current, '');

    res.sendFile(file, { root });
  }
});

if (settings.admBuildPath) app.get('/adm/*', (req, res) => {
  if (fs.existsSync(settings.admBuildPath + '/index.html')) return res.sendFile('index.html', { root: settings.admBuildPath });
});

app.get('/*', (req, res) => {
  if (fs.existsSync(settings.rootBuildPath + '/index.html')) return res.sendFile('index.html', { root: settings.rootBuildPath });
});

// Define api error middleware
app.use('/api', (error, req, res, next) => {
  log({ level: 'error', message: 'error-middleware' }, error, req);
  res.status(error.status || 400).send({ message: error.message || error.error.message });
});

export { serverHTTP, serverHTTPS };
