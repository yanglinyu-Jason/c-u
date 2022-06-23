<template>
  <div id="app">
    <cu-viewer @ready="getViewer"></cu-viewer>
  </div>
</template>

<script>
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
  methods: {
    getViewer(viewer) {
      this.viewer = viewer;
      let { defaultView } = this;
      viewer.camera.flyTo({
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



  },
};
</script>
