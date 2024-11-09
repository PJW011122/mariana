import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import { fromLonLat } from 'ol/proj.js';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import { Cluster, Vector as VectorSource, OSM } from 'ol/source.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style.js';
import { boundingExtent } from 'ol/extent.js';

export async function initializeClusterMap(targetId, distanceInput, minDistanceInput) {
  const divMap = document.getElementById(targetId);
  if (!divMap) {
    console.error('Map container not found');
    return;
  }

  try {
    // Use axios to perform the GET request
    const data = {}; // Include any parameters you need
    const response = await axios.get('/board', { params: data });
    const responseData = response.data;

    // Process data to create map features
    const features = responseData.rows.map((row) => {
      const coordinates = fromLonLat([row.coord_x, row.coord_y]);
      const feature = new Feature(new Point(coordinates));
      feature.setId(row.post_id);
      feature.setProperties({
        content: row.content,
        address: row.co_address,
      });
      return feature;
    });

    const source = new VectorSource({ features });

    const clusterSource = new Cluster({
      distance: distanceInput?.value ? parseInt(distanceInput.value, 10) : 30, // Default distance
      minDistance: minDistanceInput?.value ? parseInt(minDistanceInput.value, 10) : 10, // Default min distance
      source: source,
    });

    const styleCache = {};
    const clusters = new VectorLayer({
      source: clusterSource,
      style: function (feature) {
        const size = feature.get('features').length;
        let style = styleCache[size];
        if (!style) {
          style = new Style({
            image: new CircleStyle({
              radius: 10,
              stroke: new Stroke({ color: '#fff' }),
              fill: new Fill({ color: '#3399CC' }),
            }),
            text: new Text({
              text: size.toString(),
              fill: new Fill({ color: '#fff' }),
            }),
          });
          styleCache[size] = style;
        }
        return style;
      },
    });

    const raster = new TileLayer({ source: new OSM() });

    const map = new Map({
      layers: [raster, clusters],
      target: divMap,
      view: new View({
        center: fromLonLat([126.98214956614996, 37.52421189733802]),
        zoom: 12,
      }),
    });

    return map;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}
