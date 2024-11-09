import Feature from 'ol/Feature.js';
import Map from 'ol/Map.js';
import Point from 'ol/geom/Point.js';
import View from 'ol/View.js';
import { retryNearbyPoints } from './addressLookup.js';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style.js';
import { Cluster, OSM, Vector as VectorSource } from 'ol/source.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { boundingExtent } from 'ol/extent.js';
import { transform, fromLonLat } from 'ol/proj.js';
import 'ol/ol.css';

export function initializeClusterMap(targetId, distanceInput, minDistanceInput) {
  const divMap = document.getElementById(targetId);
  if (!divMap) {
    console.error('Map container not found');
    return;
  }

  // Convert coordinates using fromLonLat
  const centerCoord = fromLonLat([126.98214956614996, 37.52421189733802]);

  const count = 1000;
  const features = Array.from({ length: count }, () => {
    const offsetX = (Math.random() - 0.5) * 10000;
    const offsetY = (Math.random() - 0.5) * 10000;
    const coordinates = [centerCoord[0] + offsetX, centerCoord[1] + offsetY];
    return new Feature(new Point(coordinates));
  });

  const source = new VectorSource({ features });

  const clusterSource = new Cluster({
    distance: parseInt(distanceInput.value, 10),
    minDistance: parseInt(minDistanceInput.value, 10),
    source: source,
  });

  const styleCache = {};
  const clusters = new VectorLayer({
    source: clusterSource,
    style: function (feature) {
      const size = feature.get('features').length;
      let style = styleCache[size];
      if (!style) {
        style = new Style({
          image: new CircleStyle({
            radius: 10,
            stroke: new Stroke({ color: '#fff' }),
            fill: new Fill({ color: '#3399CC' }),
          }),
          text: new Text({
            text: size.toString(),
            fill: new Fill({ color: '#fff' }),
          }),
        });
        styleCache[size] = style;
      }
      return style;
    },
  });

  const raster = new TileLayer({ source: new OSM() });

  const map = new Map({
    layers: [raster, clusters],
    target: divMap,
    view: new View({
      center: centerCoord,
      zoom: 12,
    }),
  });

  // Adjust clustering settings dynamically
  distanceInput.addEventListener('input', () => {
    clusterSource.setDistance(parseInt(distanceInput.value, 10));
  });
  minDistanceInput.addEventListener('input', () => {
    clusterSource.setMinDistance(parseInt(minDistanceInput.value, 10));
  });

  const addressFound = { current: false };

  // Event listener for map clicks
  map.on('click', (e) => {
    map.forEachFeatureAtPixel(e.pixel, (feature) => {
      const features = feature.get('features');
      if (features) {
        if (features.length > 1) {
          // Zoom into clusters
          const extent = boundingExtent(features.map((f) => f.getGeometry().getCoordinates()));
          map.getView().fit(extent, { duration: 1000, padding: [50, 50, 50, 50] });
        } else if (features.length === 1) {
          // Individual point clicked
          const geometry = features[0].getGeometry();
          const coordinates = geometry.getCoordinates();
          const [longitude, latitude] = transform(coordinates, 'EPSG:3857', 'EPSG:4326');

          addressFound.current = false;
          retryNearbyPoints(longitude, latitude, 1, addressFound);
        }
      }
    });
  });

  return map;
}