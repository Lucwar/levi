import mongoose from 'mongoose';
import Debug from 'debug';
import settings from './config/settings';
import { serverHTTP, serverHTTPS } from './app';
import { createHttpTerminator } from 'http-terminator';
// import { setInitialData } from './config/data';

const debug = new Debug('api/index.js');
mongoose.plugin(require('@meanie/mongoose-to-json'));

const httpTerminator = createHttpTerminator({ server: serverHTTP });
const httpsTerminator = createHttpTerminator({ server: serverHTTPS });

const start = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(settings.database.uri, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true, 
      useCreateIndex: true, 
      maxPoolSize: 100, 
      useFindAndModify: false 
    });
    console.log('MongoDB connected successfully');

    // Start servers only if the connection is successful
    serverHTTPS.listen(settings.portHTTPS);
    serverHTTP.listen(settings.port, () => {
      settings.checkEnvironmentVariables();
      console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
      console.log(`
                    Puerto HTTP: ${settings.port}
                    Puerto HTTPS: ${settings.portHTTPS}
                    Environment: ${process.env.NODE_ENV}
                    Fecha: ${new Date().toLocaleString()}
                  `);
      console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
    });

  } catch (e) {
    // Si hay un error en la conexión a MongoDB, mostrar el error y no iniciar el servidor
    debug('Error connecting to MongoDB:', e);
    process.exit(1);
  } finally {

    // process.on('unhandledRejection', payload => log({ message: 'unhandledRejection', level: 'error' }, { name: payload }));

    [`SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach(event => process.on(event, () => gracefulShutdown(event)));

    serverHTTPS.listen(settings.portHTTPS);

    serverHTTP.listen(settings.port, () => {

      settings.checkEnvironmentVariables();

      console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
      console.log(`
                    Puerto HTTP: ${settings.port}
                    Puerto HTTPS: ${settings.portHTTPS}
                    Environment: ${process.env.NODE_ENV}
                    Fecha: ${new Date().toLocaleString()}
                  `);
      console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
    });
  }
}

const gracefulShutdown = async event => {
  mongoose.connection.close(false, (err) => {
    if (err) {
      console.error('Error closing MongoDB connection:', err);
    } else {
      console.log('MongoDB connection closed');
    }
    console.log('---------------------------------------------------------------');
    process.exit(0);
  });
};

start();
