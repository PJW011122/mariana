import React, { useEffect, useRef } from "react";
import { logAddressOnReturn } from "./feat/logPositionOnReturn";
import { initializeClusterMap } from "./feat/clusterMap";
import styled from "@emotion/styled";
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
  const distanceInput = useRef(null);
  const minDistanceInput = useRef(null);
  const mapRef = useRef(null);
  const addressFound = useRef(false);

  const handleKeydown = logAddressOnReturn(mapRef, addressFound);

  useEffect(() => {
    mapRef.current = initializeClusterMap(
      "v_map",
      distanceInput.current,
      minDistanceInput.current,
    );

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
        <img src={"images/logo.png"} width={160} height={90} />
      </S.Title>
      <Controls>
        <input
          id="distance"
          ref={distanceInput}
          type="hidden"
          defaultValue="30"
          min="10"
          max="200"
        />
        <input
          id="min-distance"
          ref={minDistanceInput}
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
