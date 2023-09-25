import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { HttpClient } from "@angular/common/http";

import { environment } from "src/environments/environment";

interface location {
  lat: string,
  lng: string,
}

@Injectable({
  providedIn: 'root'
})

export class MapService {
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v12';
  zoom = 15;
  marker: any;

  // Location Details
  globalCode: string = null;
  country: string = null;
  governorate: string = null;
  place: string = null;
  route: string = null;
  nearestPoint: string = null;

  constructor(
    private http: HttpClient,
  ) {
    mapboxgl.accessToken = environment.mapbox.accessToken;
  }

  buildMap(mapId: string, location: location, canChangeMapMarker: boolean = false) {
    this.map = new mapboxgl.Map({
      container: `${mapId}`,
      style: this.style,
      zoom: this.zoom,
      center: [location.lng, location.lat],
    })

    // Add Defualt Marker
    this.marker = new mapboxgl.Marker()
      .setLngLat([location.lng, location.lat])
      .addTo(this.map);

    // If The user Loaction
    if (canChangeMapMarker) {
      // Remove & Add Marker to the Map on Click
      this.map.on('click', address => {
        this.marker.remove();
        this.marker = new mapboxgl.Marker()
          .setLngLat([address.lngLat.lng, address.lngLat.lat])
          .addTo(this.map);
        this.getDetails(address.lngLat.lng, address.lngLat.lat)
      })
      // Map Controler
      this.map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }));
    } else {
      // If the market Loaction
      // this.map.addControl(new mapboxgl.FullscreenControl());
    }
  }

  getLocation() {
    return {
      lat: this.marker.getLngLat().lat,
      lng: this.marker.getLngLat().lng,
    }
  }

  getDetails(lng, lat) {
    this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyB81Ni6GpeDu57cIygSYufJPuI_vChaFlk`).subscribe((data) => {
      if (data['status'] === 'OK') {
        this.globalCode = data['plus_code'].global_code || null;
        this.country = data['results'][0].address_components.filter(c => c.types.indexOf('country') > -1)[0]?.long_name || null;
        this.governorate = data['results'].filter(c => c.types.indexOf('administrative_area_level_1') > -1)[0]?.address_components[0]?.long_name?.replace(' Governorate', '') || null;
        this.place = data['results'].filter(c => c.types.indexOf('administrative_area_level_2') > -1)[0]?.address_components[0]?.long_name || null;
        this.route = data['results'].filter(c => c.types.indexOf('route') > -1)[0]?.formatted_address?.replace('،', ',')?.split(',', 1) || null;
        this.route = this.route == 'Unnamed Road' ? null : this.route;
        this.nearestPoint = data['results'].filter(c => c.types.indexOf('neighborhood') > -1)[0]?.formatted_address?.replace('،', ',')?.split(',', 1) || null;
      } else {
        console.log(`Geocoder failed due to: ${data['error_message']}`);
      }
    });
  }

}