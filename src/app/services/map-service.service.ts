import { Injectable } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { ScaleLine } from 'ol/control';
import { fromLonLat } from 'ol/proj';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map!: Map;

  initializeMap(): void {
    this.map = new Map({
      target: 'map',
      view: new View({
        center: fromLonLat([-50.465, -15.0]),
        zoom: 5,
      }),
      layers: [
        new Tile({
          source: new OSM(),
        }),
      ],
      controls: [],
    });
  }

  getMap(): Map {
    return this.map;
  }

  addControls(): void {
    this.map.addControl(new ScaleLine({ bar: true, steps: 2 }));
  }
}
