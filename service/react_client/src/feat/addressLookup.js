// addressLookup.js

import axios from 'axios';
import delay from '../utils';

const apiKey = '3142667A-1CDE-31C1-A644-FD5537E3F09B';
const retryDistance = 0.0001;
const maxRetries = 5;
const delayDuration = 5; // Delay duration in milliseconds

export const fetchAddress = async (longitude, latitude, attempt, addressFound) => {
  if (addressFound.current) return false;

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
      return true;
    } else {
      console.log(`Attempt ${attempt}: Address not found at (${longitude}, ${latitude}).`);
      return false;
    }
  } catch (error) {
    console.error('Error fetching address:', error);
    return false;
  }
};

export const retryNearbyPoints = async (longitude, latitude, attempt, addressFound) => {
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
    const found = await fetchAddress(longitude + lngOffset, latitude + latOffset, attempt, addressFound);
    if (found) return;

    await delay(delayDuration);
  }

  if (!addressFound.current && attempt < maxRetries) {
    console.log(`Increasing search radius, attempt ${attempt + 1}`);
    await delay(delayDuration);
    await retryNearbyPoints(longitude, latitude, attempt + 1, addressFound);
  } else if (!addressFound.current) {
    alert('No address found after maximum attempts.');
  }
};