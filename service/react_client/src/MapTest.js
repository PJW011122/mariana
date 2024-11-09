import React, { useEffect, useRef } from 'react';
import axios from 'axios';

function MapTest() {
  const vmapRef = useRef(null);
  const addressFound = useRef(false);
  const apiKey = '3142667A-1CDE-31C1-A644-FD5537E3F09B';
  const retryDistance = 0.0001;
  const maxRetries = 5;

  useEffect(() => {
    const initMap = () => {
      const div_vmap = document.getElementById('v_map');
      if (!div_vmap) {
        console.error('Map container not found');
        return;
      }

      const { vw } = window;
      if (vw && vw.ol3 && vw.ol3.BasemapType && vw.ol3.DensityType && window.ol) {
        if (!vmapRef.current) {
          vw.ol3.MapOptions = {
            basemapType: vw.ol3.BasemapType.GRAPHIC,
            controlDensity: vw.ol3.DensityType.EMPTY,
            interactionDensity: vw.ol3.DensityType.BASIC,
            controlsAutoArrange: true,
            homePosition: vw.ol3.CameraPosition,
            initPosition: vw.ol3.CameraPosition,
          };

          const vmap = new vw.ol3.Map(div_vmap, vw.ol3.MapOptions);
          vmapRef.current = vmap;

          vmap.getView().setCenter(
            window.ol.proj.transform([126.98214956614996, 37.52421189733802], 'EPSG:4326', 'EPSG:3857')
          );
          vmap.getView().setZoom(12);
        }
      } else {
        console.error('Vworld API properties or OpenLayers (ol) not properly initialized');
      }
    };

    initMap();

    const fetchAddress = async (longitude, latitude, attempt = 1) => {
      if (addressFound.current) return false; // Early exit if address is found

      try {
        const response = await axios.get(`/req/address`, {
          params: {
            service: 'address',
            request: 'getAddress',
            version: '2.0',
            crs: 'epsg:4326',
            point: `${longitude},${latitude}`,
            format: 'json',
            type: 'road',
            zipcode: 'true',
            simple: 'false',
            key: apiKey,
          },
        });

        const address = response.data.response?.result?.[0]?.text;
        if (address) {
          console.log('\tAddress:', address);
          addressFound.current = true;
          return true; // Indicate address was found
        } else {
          console.log(`Attempt ${attempt}: Address not found at (${longitude}, ${latitude}).`);
          return false; // Indicate address not found
        }
      } catch (error) {
        console.error('Error fetching address:', error);
        return false; // Indicate failure to proceed to the next point
      }
    };

    const retryNearbyPoints = async (longitude, latitude, attempt) => {
      const currentDistance = retryDistance * attempt;
      const offsets = [
        [currentDistance, currentDistance],
        [-currentDistance, currentDistance],
        [currentDistance, -currentDistance],
        [-currentDistance, -currentDistance],
        [0, currentDistance],
        [0, -currentDistance],
        [currentDistance, 0],
        [-currentDistance, 0]
      ];

      for (let i = 0; i < offsets.length; i++) {
        if (addressFound.current) return; // Stop if address is found during retries

        const [lngOffset, latOffset] = offsets[i];
        const found = await fetchAddress(longitude + lngOffset, latitude + latOffset, attempt);
        if (found) return; // Stop further processing if address is found
      }

      // If all offsets for the current attempt level failed, increase distance and retry
      if (!addressFound.current && attempt < maxRetries) {
        console.log(`Increasing search radius, attempt ${attempt + 1}`);
        await retryNearbyPoints(longitude, latitude, attempt + 1);
      } else if (!addressFound.current) {
        console.log('No address found after maximum attempts.');
      }
    };

    const logAddressOnReturn = (event) => {
      if (event.code === 'Enter' && vmapRef.current) {
        addressFound.current = false; // Reset the flag for a new address lookup
        const center = vmapRef.current.getView().getCenter();
        const [longitude, latitude] = window.ol.proj.transform(center, 'EPSG:3857', 'EPSG:4326');
        retryNearbyPoints(longitude, latitude, 1);
      }
    };

    window.addEventListener('keydown', logAddressOnReturn);

    return () => window.removeEventListener('keydown', logAddressOnReturn);
  }, []);

  return (
    <div>
      <h1>MapTest Page</h1>
      <p>This is the MapTest page!</p>
      <div id="v_map" style={{ width: '100%', height: '500px', position: 'relative' }}>
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
