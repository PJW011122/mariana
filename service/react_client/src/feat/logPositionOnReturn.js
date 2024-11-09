// logPositionOnReturn.js

import { retryNearbyPoints } from './addressLookup';

export const logAddressOnReturn = (vmapRef, addressFound) => (event) => {
  if (event.key === 'Enter' && vmapRef.current) {
    addressFound.current = false;
    const center = vmapRef.current.getView().getCenter();

    const [longitude, latitude] = window.ol.proj.transform(center, 'EPSG:3857', 'EPSG:4326');

    retryNearbyPoints(longitude, latitude, 1, addressFound);
  }
};
