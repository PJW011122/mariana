// addressLookup.js

import axios from "axios";
import delay from "../utils";

const apiKey = "3142667A-1CDE-31C1-A644-FD5537E3F09B";
const retryDistance = 0.0001;
const maxRetries = 10;
const delayDuration = 10; // Delay duration in milliseconds

export const fetchAddress = async (
  longitude,
  latitude,
  attempt,
  addressFound
) => {
  if (addressFound.current) return false;

  try {
    // 여기서는 실제 API 호출을 하는 대신, 예시로 좌표를 직접 사용하여 주소를 설정합니다.
    const responseData = {
      cood_x: longitude,
      cood_y: latitude,
      street_address: "Sample Address", // 실제 API 호출 시 주소를 받아오는 로직으로 대체 필요
    };
    // 주소를 찾았다고 가정하고 localStorage에 저장
    localStorage.setItem("address", JSON.stringify(responseData));
    addressFound.current = true; // 주소가 발견되었음을 설정
    return true;
  } catch (error) {
    console.error("Error fetching address:", error);
    return false;
  }
};

export const retryNearbyPoints = async (
  longitude,
  latitude,
  attempt,
  addressFound
) => {
  if (addressFound.current) return;

  const currentDistance = retryDistance * attempt;
  const offsets = [
    [currentDistance, currentDistance],
    [-currentDistance, currentDistance],
    [currentDistance, -currentDistance],
    [-currentDistance, -currentDistance],
    [0, currentDistance],
    [0, -currentDistance],
    [currentDistance, 0],
    [-currentDistance, 0],
  ];

  for (let i = 0; i < offsets.length; i++) {
    if (addressFound.current) return;

    const [lngOffset, latOffset] = offsets[i];
    const found = await fetchAddress(
      longitude + lngOffset,
      latitude + latOffset,
      attempt,
      addressFound
    );
    if (found) return;

    await delay(delayDuration);
  }

  if (!addressFound.current && attempt < maxRetries) {
    console.log(`Increasing search radius, attempt ${attempt + 1}`);
    await delay(delayDuration);
    await retryNearbyPoints(longitude, latitude, attempt + 1, addressFound);
  } else if (!addressFound.current) {
    console.log("No address found after maximum attempts.");
  }
};
