// logPositionOnReturn.js

import { transform } from 'ol/proj.js';

export function logCoordinatesOnReturn(vmapRef) {
  return function(event) {
    if (event.key === 'Enter' && vmapRef.current) {
      const center = vmapRef.current.getView().getCenter();
      const [longitude, latitude] = transform(center, 'EPSG:3857', 'EPSG:4326');
      console.log(`Coordinates: Longitude: ${longitude}, Latitude: ${latitude}`);
    }
  };
}
