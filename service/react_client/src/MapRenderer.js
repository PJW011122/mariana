import React, { useEffect, useRef } from "react";
import { initializeClusterMap } from "./feat/clusterMap";
import styled from "@emotion/styled";
import { transform } from "ol/proj";
import "ol/ol.css";
import { typographies } from "./styles/typhographies";

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
  border-radius: 24px;
`;

const Controls = styled.div`
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
      <S.Title>
        <img src={"images/logo.png"} width={160} height={90} />
      </S.Title>
      <Controls>
        <input
          id="distance"
          // ref={distanceInput}
          type="hidden"
          defaultValue="30"
          min="10"
          max="200"
        />
        <input
          id="min-distance"
          // ref={minDistanceInput}
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

const S = {
  Title: styled.div`
    padding-bottom: 2px;
    padding-top: 2px;
    padding-left: 10px;
    padding-right: 10px;
    background: white;
    border-radius: 24px;
    position: fixed;
    top: 25px;
    left: 30%;
    z-index: 1001;
    ${typographies.PretendardRegular}
    font-size: 25px;
    font-weight: 600;
  `,
  BottomTab: styled.div`
    width: 420px;
    height: 100px;
    position: sticky;
    background: white;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    border: black 1px solid;
  `,
  PlusIconContainer: styled.div`
    position: absolute;
    bottom: 10%;
    left: 35%;
  `,
};
