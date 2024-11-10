import React, { useEffect, useRef } from "react";
import { initializeClusterMap } from "./feat/clusterMap";
import styled from "@emotion/styled";
import "ol/ol.css";
import { transform } from "ol/proj";
import {typographies} from "./styles/typhographies";
import toast from "react-hot-toast";

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
  border-radius: 24px;
`;

const Title = styled.div`
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
        mapRef.current = await initializeClusterMap(
          "v_map",
          null,
          null,
          onMarkerClick
        );
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

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      if (mapRef.current) {
        mapRef.current.setTarget(null);
      }
    };
  }, [onMarkerClick]);

  const handleCrossHeader = () => {
    if (
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
      toast.success("좌표 설정에 성공하셨습니다!")
    }
  };

  return (
    <MapContainer>
      <Title>
        <img src={"images/logo.png"} width={160} height={90} alt="Logo" />
      </Title>
      <Controls>
        <input
          id="distance"
          type="hidden"
          defaultValue="30"
          min="10"
          max="200"
        />
        <input
          id="min-distance"
          type="hidden"
          defaultValue="30"
          min="0"
          max="100"
        />
      </Controls>
      <MapWrapper id="v_map">
        <Crosshair vertical onClick={handleCrossHeader} />
        <Crosshair onClick={handleCrossHeader}/>
      </MapWrapper>
    </MapContainer>
  );
}

export default MapRenderer;
