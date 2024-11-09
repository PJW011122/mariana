import React, { useEffect, useRef } from "react";
import { initializeClusterMap } from "./feat/clusterMap";
import styled from "@emotion/styled";
import { transform } from "ol/proj";
import "ol/ol.css";

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
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
  transform: ${(props) =>
    props.vertical
      ? "translate(-50%, -50%) rotate(90deg)"
      : "translate(-50%, -50%)"};
  width: 2px;
  height: 24px;
  background-color: red;
  z-index: 1;
`;

function MapRenderer() {
  const mapRef = useRef(null);
  const coordinatesRef = useRef({ longitude: null, latitude: null });

  useEffect(() => {
    async function setupMap() {
      mapRef.current = await initializeClusterMap("v_map");

      mapRef.current.getView().on("change:center", () => {
        const center = mapRef.current.getView().getCenter();
        if (center) {
          const [longitude, latitude] = transform(center, "EPSG:3857", "EPSG:4326");
          coordinatesRef.current = { longitude, latitude };
        }
      });
    }

    setupMap();

    // Define the handleKeydown function to log the latest coordinates from the ref
    const handleKeydown = (event) => {
      if (event.key === "Enter" && coordinatesRef.current.longitude !== null && coordinatesRef.current.latitude !== null) {
        console.log(`Longitude: ${coordinatesRef.current.longitude}, Latitude: ${coordinatesRef.current.latitude}`);
      }
    };

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      if (mapRef.current) {
        mapRef.current.setTarget(null);
      }
    };
  }, []); // Empty dependency array to ensure the map initializes only once

  return (
    <MapContainer>
      <MapWrapper id="v_map">
        <Crosshair vertical />
        <Crosshair />
      </MapWrapper>
    </MapContainer>
  );
}

export default MapRenderer;
