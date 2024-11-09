// logPositionOnReturn.js

import { transform } from 'ol/proj.js';
import { retryNearbyPoints } from './addressLookup.js';

export function logAddressOnReturn(vmapRef, addressFound) {
  return function(event) {
    if (event.key === 'Enter' && vmapRef.current) {
      addressFound.current = false;
      const center = vmapRef.current.getView().getCenter();
      const [longitude, latitude] = transform(center, 'EPSG:3857', 'EPSG:4326');
      retryNearbyPoints(longitude, latitude, 1, addressFound);
    }
  };
}
