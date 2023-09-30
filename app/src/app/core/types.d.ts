interface EndPointParamsBasic {
  body?: {[k: string]: any},
  loader?: boolean,
  useUrl?: number,
  id?: string
}

interface EndPointParamsGETOne extends EndPointParamsBasic {
  filters: {[k: string]: any},
  select: string[],
  populates: any[],
  queryParams: {[k: string]: string},
  findOne: boolean,
}

interface EndPointParams extends EndPointParamsGETOne {
  sort: {[k: string]: number},
  page: number,
  perPage: number,
}

interface EndPointParamsExternalURL {
  body: {[k: string]: any},
  loader?: boolean,
  url: string
}

interface FormDataFile {
  data: string | Blob,
  key: string,
  name?: string,
}

interface EndPointParamsFormData {
  files: FormDataFile[],  
  loader?: boolean,
  useUrl: number,
  extraParams?: {[k: string]: string}
}

interface BackButtonBehavior {
  key: 'navigate' | 'prevent',
  route?: string
}

type DiagnosticPermissions = ('Microphone' | 'Camera' | 'Location' | 'GPS' | 'BackgroundLocation')[];

interface ShowImageUploadParams {
  loader?: boolean,
  quality?: 'high' | 'low' | 'medium',
  enableVideos?: boolean,
  image?: string
}

interface OpenGoogleMapsParams {
  lat: number,
  lng: number,
  type: 'marker' | 'destination'
}

interface InfiniteScrollEvent extends CustomEvent {
  target: HTMLIonInfiniteScrollElement;
}

interface MongoObject {
  id: string,
  [k: string]: any
}

interface User extends MongoObject {
  roles: string[],
  enabled: boolean,
  username: string,
  emailAddress: string,
  online?: boolean,
}

interface GuardRouteData {
  noUser?: boolean,
  redirect?: string,
  roles: string[],
  additionalCheck?: (user: User) => string | null
}

interface PopoverProps {
  elements: PopoverElement[],
  maxYear?: string,
  filters: {[k: string]: any}
}

interface PopoverElement {
  elementType: 'label' | 'item',
  label: string,
  itemType?: 'checkbox' | 'dateTime' | 'label',
  key?: 'since' | 'until' | string,
  value?: string
}

interface Address {
  address: string,
  addressGoogle: string,
  location: {
    type: 'Point',
    coordinates: [number, number]
  }
}

interface Coordinates {
  lat: number,
  lng: number
}

interface ShareQRParams {
  message?: string,
  subject?: string,
  type?: 'img' | 'canvas',
  isHidden?: boolean,
  errorMessage?: string,
  elementQuerySelector: string | any
}

interface CopyToClipboardParams {
  text: string,
  message?: string,
}

interface AlertModalParams {
  title?: string,
  subtitle?: string,
  showCloseButton?: boolean,
  actions: AlertModalAction[]
}

interface AlertModalAction {
  label: string,
  class?: string,
  condition?: boolean,
  handler: Function
}

interface DownloadParams {
  url: string,
  fileName: string,
}