export class Settings {
  // Global Settings
  public static APP_NAME = 'LeviApp';
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
    actions: '/actions',
    administrators: '/administrators',
    files: '/files',
    logs: '/logs',
    users: '/users',
    songs: '/songs',
    lists: '/lists',
    listGroups: '/listGroups',
    annotations: '/annotations',
  };

  public static endPointsMethods = {
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
    accessToken: 'levi.accessToken',
    actions: 'levi.actions',
    actionsToPerform: 'levi.actionsToPerform',
    refreshToken: 'levi.refreshToken',
    user: 'levi.user',
    address: 'levi.address',
    listGroups: 'levi.listGroups',
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

  public static notes = [
    { name: 'C', grado: 1},
    { name: 'C#', grado: 2},
    { name: 'D', grado: 3},
    { name: 'D#', grado: 4},
    { name: 'E', grado: 5},
    { name: 'F', grado: 6},
    { name: 'F#', grado: 7},
    { name: 'G', grado: 8},
    { name: 'G#', grado: 9},
    { name: 'A', grado: 10},
    { name: 'A#', grado: 11},
    { name: 'B', grado: 12},
  ]

  public static notesObject = Object.values(this.notes);

  public static notesWithMinors = [
    { name: 'C', grado: 1},
    { name: 'C#', grado: 2},
    { name: 'D', grado: 3},
    { name: 'D#', grado: 4},
    { name: 'E', grado: 5},
    { name: 'F', grado: 6},
    { name: 'F#', grado: 7},
    { name: 'G', grado: 8},
    { name: 'G#', grado: 9},
    { name: 'A', grado: 10},
    { name: 'A#', grado: 11},
    { name: 'B', grado: 12},
  ]

  public static chunkArray(array: any[], chunkSize: number): any[] {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }
  
  public static matrizNotes = this.chunkArray(Settings.notes, 4);
  // public static extension = ['','m','m7','7','maj7','9']
  public static extension = ['m','m7','7','maj7','9']

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
