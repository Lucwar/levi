// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiVersion: 'v1',
  // serverUrl: 'http://localhost:3122/api',
  // filesUrl: 'http://localhost:3122/files',
  // socketUrl: 'http://localhost:3122',

  serverUrl: 'https://leviapi.onrender.com/api',
  filesUrl: 'https://leviapi.onrender.com/files',
  socketUrl: 'https://leviapi.onrender.com/',

  // serverUrl: 'http://192.168.0.70:3122/api',
  // filesUrl: 'http://192.168.0.70:3122/files',
  // socketUrl: 'http://192.168.0.70:3122',

  // serverUrl: 'https://camarcoapp.com.ar/api',
  // filesUrl: 'https://camarcoapp.com.ar/files',
  // socketUrl: 'https://camarcoapp.com.ar',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
