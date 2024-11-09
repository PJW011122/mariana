import React, { useEffect, useRef } from 'react';
import { logAddressOnReturn } from './feat/logPositionOnReturn';
import { initializeClusterMap } from './feat/clusterMap';
import styled from "@emotion/styled";
import 'ol/ol.css';

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Controls = styled.div`
  padding: 10px;
  background: white;
  z-index: 1;
`;

const MapWrapper = styled.div`
  width: 100%;
  flex: 1;
  position: relative;
`;

const Crosshair = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: ${props => props.vertical ? 
    'translate(-50%, -50%) rotate(90deg)' : 
    'translate(-50%, -50%)'};
  width: 2px;
  height: 24px;
  background-color: red;
  z-index: 1;
`;

function MapRenderer() {
  const distanceInput = useRef(null);
  const minDistanceInput = useRef(null);
  const mapRef = useRef(null);
  const addressFound = useRef(false);

  useEffect(() => {
    mapRef.current = initializeClusterMap('v_map', distanceInput.current, minDistanceInput.current);

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
    <MapContainer>
      <Controls>
        <label>Cluster Distance: </label>
        <input id="distance" ref={distanceInput} type="number" defaultValue="30" min="10" max="200" />
        <label> Min Distance: </label>
        <input id="min-distance" ref={minDistanceInput} type="number" defaultValue="30" min="0" max="100" />
      </Controls>
      <MapWrapper id="v_map">
        <Crosshair vertical />
        <Crosshair />
      </MapWrapper>
    </MapContainer>
  );
}

export default MapRenderer;