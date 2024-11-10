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
import { boundingExtent } from "ol/extent.js";

export async function initializeClusterMap(
  targetId,
  distanceInput,
  minDistanceInput,
  onMarkerClick // 콜백 함수 추가
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
        coord_x: row.coord_x, // Store original coord_x
        coord_y: row.coord_y, // Store original coord_y
        co_status: row.co_status, // co_status 속성 추가
      });
      return feature;
    });

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

    // 마커 클릭 이벤트 처리
    map.on("singleclick", function (evt) {
      const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
      });
    
      if (feature) {
        const features = feature.get("features");
        if (features.length === 1) {
          const clickedFeature = features[0];
          const postId = clickedFeature.getId();
    
          // Retrieve the original coordinates from the feature's properties
          const coordX = clickedFeature.get('coord_x');
          const coordY = clickedFeature.get('coord_y');
    
          // Ensure onMarkerClick is a function before calling it
          if (typeof onMarkerClick === "function") {
            // Pass the coordinates to your callback function
            onMarkerClick(postId, coordX, coordY);
          } else {
            console.error("onMarkerClick is not a function");
          }
        } else {
          // Handle cluster expansion
          const extent = boundingExtent(
            features.map((f) => f.getGeometry().getCoordinates())
          );
          map.getView().fit(extent, { duration: 500 });
        }
      }
    });

    return map;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
