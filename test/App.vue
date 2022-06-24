<template>
  <div id="app">
    <cu-viewer @ready="getViewer"></cu-viewer>
  </div>
</template>

<script>
let cesium = null;
import { CuViewer } from "../packages/viewer";
export default {
  name: "app",
  data() {
    return {
      defaultView: {
        lon: 118.7863,
        lat: 31.9087,
        alt: 801.6425,
        heading: this.cesium.Math.toRadians(1.724684714172732),
        pitch: this.cesium.Math.toRadians(-53.783141852231246),
        roll: 0.008819224020548466,
        range: 5000.0,
      },
      viewer: null,
    };
  },
  components: {
    CuViewer,
  },
  created() {
    cesium = this.cesium;
  },
  methods: {
    getViewer(viewer) {
      this.viewer = viewer;
      this.getFlyTO(this.defaultView);
      this.getPosition(viewer);
      this.tilesetload(viewer);
    },
    getFlyTO(defaultView) {
      // let { defaultView } = this;
      this.viewer.camera.flyTo({
        // fromDegrees()将经纬度和高程转换为世界坐标
        destination: this.cesium.Cartesian3.fromDegrees(
          defaultView.lon,
          defaultView.lat,
          defaultView.alt
        ),
        orientation: {
          // 指向
          heading: defaultView.heading,
          // 视角
          pitch: defaultView.pitch,
          roll: defaultView.roll,
        },
      });
    },
    getPosition(viewer) {
      var canvas = viewer.scene.canvas;
      //具体事件的实现
      var ellipsoid = viewer.scene.globe.ellipsoid;
      var handler = new this.cesium.ScreenSpaceEventHandler(canvas);
      handler.setInputAction(function (movement) {
        //捕获椭球体，将笛卡尔二维平面坐标转为椭球体的笛卡尔三维坐标，返回球体表面的点
        var cartesian = viewer.camera.pickEllipsoid(
          movement.endPosition,
          ellipsoid
        );
        if (cartesian) {
          //将笛卡尔三维坐标转为地图坐标（弧度）
          var cartographic =
            viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
          //将地图坐标（弧度）转为十进制的度数
          var lat_String = cesium.Math.toDegrees(cartographic.latitude).toFixed(
            4
          );
          var log_String = cesium.Math.toDegrees(
            cartographic.longitude
          ).toFixed(4);
          var alti_String = (
            viewer.camera.positionCartographic.height / 1000
          ).toFixed(2);
          var elec_String = viewer.scene.globe
            .getHeight(cartographic)
            .toFixed(4);
          // console.log(lat_String, log_String, alti_String, elec_String);

          // longitude_show.innerHTML = log_String;
          // latitude_show.innerHTML = lat_String;
          // altitude_show.innerHTML = alti_String; //视角高度 km
          // elevation_show.innerHTML = elec_String; //海拔
        }
      }, this.cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },
    tilesetload(viewer) {
      const tilesetData = viewer.scene.primitives.add(
        new cesium.Cesium3DTileset({
          url: 'http://221.229.121.123:8000/bee/open-63079029343256634/bim/pavementBim/tileset.json',
        })
      );

    //   tilesetData.readyPromise
    //     .then(function (tileset) {
    //       console.log('3322332',tileset)
    //       viewer.zoomTo(
    //         tileset,
    //         new cesium.HeadingPitchRange(
    //           0.5,
    //           -0.2,
    //           tileset.boundingSphere.radius * 4.0
    //         )
    //       );
    //     })
    //     .catch(function (error) {
    //       console.log(error);
    //     });
    },
  },
};
</script>
