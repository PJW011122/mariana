import React, { useEffect, useRef } from "react";
import { logCoordinatesOnReturn } from "./feat/logPositionOnReturn";
import { initializeClusterMap } from "./feat/clusterMap";
import styled from "@emotion/styled";
import "ol/ol.css";

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
  transform: ${(props) =>
    props.vertical
      ? "translate(-50%, -50%) rotate(90deg)"
      : "translate(-50%, -50%)"};
  width: 2px;
  height: 24px;
  background-color: red;
  z-index: 1;
`;

function MapRenderer({ onMarkerClick }) {
  const distanceInput = useRef(null);
  const minDistanceInput = useRef(null);
  const mapRef = useRef(null);
  const coordinatesRef = useRef({ longitude: null, latitude: null });
  const addressFound = useRef(false);

  useEffect(() => {
    async function setupMap() {
      try {
        mapRef.current = await initializeClusterMap("v_map");
        if (mapRef.current) {
          mapRef.current.getView().on("change:center", () => {
            const center = mapRef.current.getView().getCenter();
            if (center) {
              const [longitude, latitude] = transform(
                center,
                "EPSG:3857",
                "EPSG:4326"
              );
              coordinatesRef.current = { longitude, latitude };
            }
          });
        }
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    }

    setupMap();

    const handleKeydown = (event) => {
      if (
        event.key === "Enter" &&
        coordinatesRef.current.longitude !== null &&
        coordinatesRef.current.latitude !== null
      ) {
        console.log(
          `Longitude: ${coordinatesRef.current.longitude}, Latitude: ${coordinatesRef.current.latitude}`
        );
        const responseData = {
          cood_x: coordinatesRef.current.longitude,
          cood_y: coordinatesRef.current.latitude,
        };

        localStorage.setItem("address", JSON.stringify(responseData));
        addressFound.current = true;
      }
    };

    initializeMap();

    // Set up a keydown event listener to log coordinates on every Enter press
    const handleKeydown = logCoordinatesOnReturn(mapRef);
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      if (mapRef.current) {
        mapRef.current.setTarget(null);
      }
    };
  }, []);

  return (
    <MapContainer>
      <S.Title>
        <img src={"images/logo.png"} width={160} height={90} alt="Logo" />
      </S.Title>
      <Controls>
        <label>Cluster Distance: </label>
        <input
          id="distance"
          type="hidden"
          defaultValue="30"
          min="10"
          max="200"
        />
        <label> Min Distance: </label>
        <input
          id="min-distance"
          type="hidden"
          defaultValue="30"
          min="0"
          max="100"
        />
      </Controls>
      <MapWrapper id="v_map">
        <Crosshair vertical />
        <Crosshair />
      </MapWrapper>
    </MapContainer>
  );
}

export default MapRenderer;
