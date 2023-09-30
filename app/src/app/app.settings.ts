export class Settings {
  // Global Settings
  public static APP_NAME = 'AIC';
  public static APP_VERSION = '0.0.1';
  public static APP_MODE_INT = false;

  public static LOADER_TEXT = 'Procesando...';

  public static networkConnection = true;

  public static SOCKET_ENABLED = false;

  public static links = {
    terms: 'https://investorslatam.com/terms-and-conditions',
  }

  // (+) EndPoints
  public static endPoints = {

    bnaRates: '/bnaRates',
    construya: '/construya',
    icc: '/icc',
    iop: '/iop',
    iopFactors: '/iopFactors',
    isac: '/isac',
    labor: '/labor',
    materials: '/materials',
    registeredEmployment: '/registeredEmployment',
    actions: '/actions',
    administrators: '/administrators',
    files: '/files',
    logs: '/logs',
    users: '/users',
    rates: '/rates',
  };

  public static endPointsMethods = {
    iopFactors: {
      code: '/code'
    },
    rates: {
      lastDataAvailable: '/lastDataAvailable'
    },
    users: {
      create: '/create',
      login: '/login',
      deleteAccount: '/deleteAccount',
      newPassword: '/newPassword',
      changePassword: '/changePassword/',
      recoverPassword: '/recoverPassword',
      refreshToken: '/refreshToken',
    },
  };

  public static storage = {
    accessToken: 'finde.accessToken',
    actions: 'finde.actions',
    actionsToPerform: 'finde.actionsToPerform',
    refreshToken: 'finde.refreshToken',
    user: 'finde.user',
    address: 'finde.address'
  };

  public static actions = {
    types: {
      push: {
        code: 'push',
        name: 'Action'
      },
      'deep-link': {
        code: 'deep-link',
        name: 'deepLinking'
      },
      socket: {
        code: 'socket',
        name: 'Event'
      }
    }
  };

  // (+) Keys
  public static keys = {
    googleMaps: 'AIzaSyAMrhJP5YW6rgpFfW1COIhNUjrbSc2qHlo'
    // googleMaps: 'AIzaSyBZBcA9sl890-ogezSTLJEj5ICTMxWOgc4', // To Do: Change to your own key
  }
  // (-) Keys

  public static roles = {
    user: 'user',
  };

  // (+) Push
  public static push = {
    icon: {
      name: 'ic_stat_notifications',
      color: '#FC6600',
    },
    events: {
      onNotification: 'onNotification'
    },
    channel: {
      default: ''
    },
    appId: '',
    urls: {
      ensure: 'http://vps-1060583-x.dattaweb.com:3050/api/users/ensure',
      unensure: 'http://vps-1060583-x.dattaweb.com:3050/api/users/unensure'
    }
  };
  // (-) Push

  public static months = {
    1: 'Enero',
    2: 'Febrero',
    3: 'Marzo',
    4: 'Abril',
    5: 'Mayo',
    6: 'Junio',
    7: 'Julio',
    8: 'Agosto',
    9: 'Septiembre',
    10: 'Octubre',
    11: 'Noviembre',
    12: 'Diciembre',
  }

  public static colors = [
    '#B92232',
    '#2dd36f',
    '#5260ff',
    '#ffc409',
  ]

  public static rates = {
    iop: {
      code: 'iop',
      label: 'IOP',
    },
    iopFactors: {
      code: 'iopFactors',
      label: 'IOP',
    },
    icc: {
      code: 'icc',
      label: 'ICC',
      sources: ['cac', 'dgec', 'indec']
    },
    isac: {
      code: 'isac',
      label: 'ISAC',
    },
    construya: {
      code: 'construya',
      label: 'ÍNDICE CONSTRUYA',
    },
    registeredEmployment: {
      code: 'registeredEmployment',
      label: 'EMPLEO REGISTRADO',
    },
    bnaRates: {
      code: 'bnaRates',
      label: 'TASA BANCO NACIÓN',
    },
    materials: {
      code: 'materials',
      label: 'MATERIALES',
      sources: ['cac', 'dgec', 'indec']
    },
    labor: {
      code: 'icc',
      label: 'MANO DE OBRA',
      sources: ['cac', 'dgec', 'indec']
    },
  };

}
