import React, { useEffect, useRef } from 'react';
import { logAddressOnReturn } from './feat/logPositionOnReturn';
import { initializeClusterMap } from './feat/clusterMap';

function MapTest() {
  const distanceInput = useRef(null);
  const minDistanceInput = useRef(null);
  const mapRef = useRef(null);
  const addressFound = useRef(false);

  useEffect(() => {
    // Initialize clustering map
    mapRef.current = initializeClusterMap('v_map', distanceInput.current, minDistanceInput.current);

    // Event listener for logging address on "Enter" key press
    const handleKeydown = logAddressOnReturn(mapRef, addressFound);
    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
      if (mapRef.current) {
        mapRef.current.setTarget(null);
      }
    };
  }, []);

  return (
    <div>
      <h1>MapTest Page</h1>
      <p>This is the MapTest page with clustering and address logging features</p>
      <div>
        <label>Cluster Distance: </label>
        <input id="distance" ref={distanceInput} type="number" defaultValue="30" min="10" max="200" />
        <label> Min Distance: </label>
        <input id="min-distance" ref={minDistanceInput} type="number" defaultValue="30" min="0" max="100" />
      </div>
      <div id="v_map" style={{ width: '100%', height: '500px', position: 'relative' }}>
        {/* Crosshair in the center of the map */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '2px',
            height: '24px',
            backgroundColor: 'red',
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(90deg)',
            width: '2px',
            height: '24px',
            backgroundColor: 'red',
            zIndex: 1,
          }}
        />
      </div>
    </div>
  );
}

export default MapTest;
