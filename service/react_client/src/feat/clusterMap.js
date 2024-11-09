// initializeClusterMap.js

import axios from "axios";
import Feature from "ol/Feature.js";
import Point from "ol/geom/Point.js";
import { fromLonLat } from "ol/proj.js";
import Map from "ol/Map.js";
import View from "ol/View.js";
import { Cluster, Vector as VectorSource, OSM } from "ol/source.js";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js";
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from "ol/style.js";

/**
 * 지도를 초기화하고 클러스터링된 피처를 표시합니다.
 *
 * @param {string} targetId - 지도가 렌더링될 HTML 요소의 ID.
 * @param {HTMLElement} distanceInput - 클러스터링 거리 값을 포함하는 입력 요소.
 * @param {HTMLElement} minDistanceInput - 최소 클러스터링 거리 값을 포함하는 입력 요소.
 * @returns {Map} OpenLayers Map 객체.
 */
export async function initializeClusterMap(
  targetId,
  distanceInput,
  minDistanceInput
) {
  const divMap = document.getElementById(targetId);
  if (!divMap) {
    console.error("Map container not found");
    return;
  }

  try {
    // 서버에서 데이터 가져오기
    const data = {}; // 필요한 파라미터가 있으면 추가
    const response = await axios.get("/board", { params: data });
    const responseData = response.data;

    // 피처 스타일 미리 정의
    const styles = {
      singleFeature: {
        default: new Style({
          image: new CircleStyle({
            radius: 10,
            stroke: new Stroke({ color: "#fff" }),
            fill: new Fill({ color: "#3399CC" }), // 기본 색상
          }),
        }),
        status0: new Style({
          image: new CircleStyle({
            radius: 10,
            stroke: new Stroke({ color: "#fff" }),
            fill: new Fill({ color: "red" }), // co_status = 0: 빨간색
          }),
        }),
        status1: new Style({
          image: new CircleStyle({
            radius: 10,
            stroke: new Stroke({ color: "#fff" }),
            fill: new Fill({ color: "blue" }), // co_status = 1: 파란색
          }),
        }),
      },
      cluster: new Style({
        image: new CircleStyle({
          radius: 15,
          stroke: new Stroke({ color: "#fff" }),
          fill: new Fill({ color: "#3399CC" }), // 클러스터 색상
        }),
        text: new Text({
          text: "",
          fill: new Fill({ color: "#fff" }),
        }),
      }),
    };

    // 피처 생성
    const features = responseData.rows.map((row) => {
      const coordinates = fromLonLat([row.coord_x, row.coord_y]);
      const feature = new Feature(new Point(coordinates));
      feature.setId(row.post_id);
      feature.setProperties({
        content: row.content,
        address: row.co_address,
        co_status: row.co_status, // co_status 속성 추가
      });
      return feature;
    });
    console.log(features, "피처");

    const source = new VectorSource({ features });

    const clusterSource = new Cluster({
      distance: distanceInput?.value ? parseInt(distanceInput.value, 10) : 30, // 기본 거리
      minDistance: minDistanceInput?.value
        ? parseInt(minDistanceInput.value, 10)
        : 10, // 기본 최소 거리
      source: source,
    });

    const clusters = new VectorLayer({
      source: clusterSource,
      style: function (feature) {
        const size = feature.get("features").length;

        if (size === 1) {
          // 단일 피처인 경우 co_status 값에 따라 스타일 설정
          const originalFeature = feature.get("features")[0];
          const co_status = originalFeature.get("co_status");
          if (co_status === 0) {
            return styles.singleFeature.status0;
          } else if (co_status === 1) {
            return styles.singleFeature.status1;
          } else {
            return styles.singleFeature.default;
          }
        } else {
          // 클러스터인 경우 기본 클러스터 스타일 설정
          const clusterStyle = styles.cluster;
          clusterStyle.getText().setText(size.toString());
          return clusterStyle;
        }
      },
    });

    const raster = new TileLayer({ source: new OSM() });

    const map = new Map({
      layers: [raster, clusters],
      target: divMap,
      view: new View({
        center: fromLonLat([126.98214956614996, 37.52421189733802]), // 초기 중심 좌표 (경도, 위도)
        zoom: 12, // 초기 줌 레벨
      }),
    });

    return map;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
