import { Directive, ViewChild, ElementRef } from '@angular/core';
import { ItemPage } from './item.page';

declare var google;

@Directive({ selector: '[mapPage]' })
export abstract class MapBasePage extends ItemPage {

  @ViewChild('map') mapElement: ElementRef;

  textSearch: string;
  map: any;
  marker: any;
  geocoder: any;
  address: Address;
  googleAutocomplete: any;
  autocompleteItems: any = [];
  updateView = true;

  ngOnInit() {
    this.loadMap();
    this.initialize();
  }

  private loadMap(): void {

    this.pageService.showLoading();

    this.pageService.loadGoogleMapsLibrary().then((google: any) => {

      this.googleMapsLibraryLoaded();

      this.geocoder = new google.maps.Geocoder();
      this.googleAutocomplete = new google.maps.places.AutocompleteService();

      this.waitMapElementLoaded();

    }).catch(err => this.pageService.hideLoading());
  }

  googleMapsLibraryLoaded(): void {

  }

  checkLoadingsMap() {
    return this.mapElement && !this.processing;
  }

  private waitMapElementLoaded() {

    if (!this.checkLoadingsMap()) return setTimeout(() => this.waitMapElementLoaded());

    this.initializeMap();
  }

  initializedMap() {

  }

  initializeMapPre() {
  }

  loadAddress() {
    this.address = this.item ? {
      address: this.item.address,
      addressGoogle: this.item.addressGoogle,
      location: this.item.location || { type: 'Point', coordinates: [] }
    } : this.global.load(this.settings.storage.address) || {
      address: '',
      addressGoogle: '',
      location: {
        type: 'Point',
        coordinates: [0, 0]
      }
    };
  }

  initializeMap() {

    this.initializeMapPre();

    this.loadAddress();

    this.pageService.zone.run(() => {

      try {

        this.map = new google.maps.Map(this.mapElement.nativeElement, this.getMapOptions());

        if (this.address?.location?.coordinates[0] && this.address?.location?.coordinates[1]) this.setPosition({
          lng: this.address?.location.coordinates[0],
          lat: this.address?.location.coordinates[1],
        }); else this.setCurrentPosition();

        this.initializedMap();

      } catch (error) {
        console.log(error);
      }
    });

    this.pageService.hideLoading();
  }

  setCurrentPosition() {
    this.pageService.getCurrentLocation()
      .then(position => {
        this.setPosition(position);
        this.findAddress(position);
      }).catch(e => console.error(e));
  }

  setPosition(position: { lng: number, lat: number }) {

    if (!position || !this.map) return;

    if (this.marker) this.marker.setPosition(new google.maps.LatLng(position.lat, position.lng));
    else {
      this.marker = new google.maps.Marker({
        draggable: !this.isWatching,
        animation: google.maps.Animation.DROP,
        position: position,
        map: this.map,
        ...this.getMarkerIcon()
      });

      if (!this.isWatching) {
        google.maps.event.addListener(this.marker, 'dragend', () => {
          const position = {
            lat: this.marker.position.lat(),
            lng: this.marker.position.lng()
          };
          this.setPosition(position);
          this.findAddress(position);
        });
      }
    };

    this.address.location.coordinates = [position.lng, position.lat];

    this.latLngDefined();

    if (this.updateView) this.map.setCenter(position);

    this.pageService.hideLoading();
  }

  latLngDefined() {
  }

  isAddressDefined() {
    return this.address?.address && this.address?.location.type === 'Point' && this.address?.location.coordinates?.length === 2;
  }

  extraValuesDefined() {
    return true;
  }

  findAddressByText(text: string) {
    this.geocoder.geocode({ address: text }, (addresses, status) => {
      if (status === 'OK' && addresses[0] && addresses[0].geometry && addresses[0].geometry.location) {
        const position = {
          lat: addresses[0].geometry.location.lat(),
          lng: addresses[0].geometry.location.lng()
        };
        this.setPosition(position);
        this.updateAddress(addresses);
      }
    });
  }

  findAddress(location: { lng: number, lat: number }) {
    this.geocoder.geocode({ location }, (addresses, status) => this.updateAddress(addresses));
  }

  updateAddress(addresses) {
    this.pageService.zone.run(() => {

      this.address.address = addresses?.[0]?.formatted_address;
      this.address.addressGoogle = addresses?.[0]?.formatted_address;

      this.addressUpdated();
    });
  }

  addressUpdated() {

  }

  getMarkerIcon(): { icon?: { [k: string]: any } } | any {
    return {};
  }

  getPlacePredictions() {

    if (!this.address?.address?.trim()) return;

    this.googleAutocomplete.getPlacePredictions({ input: this.textSearch }, (predictions, status) => {

      this.autocompleteItems = [];

      if (!predictions) return;

      this.pageService.zone.run(() => this.autocompleteItems = predictions);
    });
  }

  selectSearchResult(place) {

    this.autocompleteItems = [];

    this.address.address = place.description;
    this.address.addressGoogle = place.description;

    this.getPositionFromPlace(place.place_id)
      .then(res => this.setPosition(res.position))
      .catch(e => this.pageService.showError(e.message));
  }

  getPositionFromPlace(placeId): Promise<{ country?: string, position }> {

    return new Promise(async (resolve, reject) => {
      this.geocoder.geocode({ placeId }, (addresses, status) => {
        if (status === 'OK' && addresses[0] && addresses[0].geometry && addresses[0].geometry.location) resolve({
          country: addresses[0].types.includes('country') && addresses[0].address_components[0].types.includes('country') ? addresses[0].address_components[0].short_name : null,
          position: {
            lat: addresses[0].geometry.location.lat(),
            lng: addresses[0].geometry.location.lng()
          }
        }); else reject({ message: 'Error al obtener la ubicación', status });
      });
    });
  }

  save() {
    this.global.save(this.settings.storage.address, this.address);
    this.pageService.navigateBack();
  }

  getMapOptions(): { [k: string]: any } {
    return {
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [{ "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e9e9e9" }, { "lightness": 17 }] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 20 }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }, { "lightness": 17 }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#ffffff" }, { "lightness": 29 }, { "weight": 0.2 }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 18 }] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 16 }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 21 }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#dedede" }, { "lightness": 21 }] }, { "elementType": "labels.text.stroke", "stylers": [{ "visibility": "on" }, { "color": "#ffffff" }, { "lightness": 16 }] }, { "elementType": "labels.text.fill", "stylers": [{ "saturation": 36 }, { "color": "#333333" }, { "lightness": 40 }] }, { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#f2f2f2" }, { "lightness": 19 }] }, { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#fefefe" }, { "lightness": 20 }] }, { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#fefefe" }, { "lightness": 17 }, { "weight": 1.2 }] }],
      disableDoubleClickZoom: false,
      disableDefaultUI: true,
      // zoomControl: true,
      scaleControl: true,
    };
  }
}
