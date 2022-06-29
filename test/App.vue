<template>
  <div id="app">
    <cu-viewer
      style="height: 100%"
      :defaultView="defaultView"
      @init="initView"
    ></cu-viewer>
  </div>
</template>

<script>
let cesium = null;
import { CuViewer } from "../packages/viewer";
export default {
  name: "app",
  provide() {
    return {
      getViewer: this.getViewer, //注意这里不加()
    };
  },
  data() {
    return {
      defaultView: {
        lon: 117.323625,
        lat: 31.789074,
        alt: 349685.0,
        // heading:cesium.Math.toRadians(1.724684714172732),
        // pitch: cesium.Math.toRadians(-53.783141852231246),
        // roll: 0.008819224020548466,
        // range: 5000.0,
      },
      viewer: null,
    };
  },
  components: {
    CuViewer,
  },
  created() {},
  methods: {
    tilesetload(viewer) {
      const tileSet = viewer.scene.primitives.add(
        new this.cesium.Cesium3DTileset({
          url: "http://221.229.121.123:8000/bee/open-63079029343256634/bim/pavementBim/tileset.json",
        })
      );
      tileSet.readyPromise.then(function (tileSet) {
        var longitude = 118.7863; //模型需要改变的经度
        var latitude = 31.9087; //模型需要改变的纬度
        var heightOffset = 801.6425; //模型需要改变的高度

        //获取3Dtlies的bounds范围
        var boundingSphere = palaceTileset.boundingSphere;
        //获取3Dtlies的范围中心点的弧度
        var cartographic = Cesium.Cartographic.fromCartesian(
          boundingSphere.center
        );
        //定义3Dtlies改变之后中心点的弧度
        var offsetvalue = Cesium.Cartographic.fromDegrees(
          longitude,
          latitude,
          heightOffset
        );

        //模型本身的位置
        var surface = Cesium.Cartesian3.fromRadians(
          cartographic.longitude,
          cartographic.latitude,
          0.0
        );
        //模型改变的位置
        var offset = Cesium.Cartesian3.fromRadians(
          offsetvalue.longitude,
          offsetvalue.latitude,
          heightOffset
        );

        //定义模型的改变状态
        var translation = Cesium.Cartesian3.subtract(
          offset,
          surface,
          new Cesium.Cartesian3()
        );
        //修改模型的位置
        palaceTileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
        viewer.zoomTo(
          palaceTileset,
          new Cesium.HeadingPitchRange(
            0.5,
            -0.2,
            palaceTileset.boundingSphere.radius * 1.0
          )
        );
      });
    },
    update3dtilesMaxtrix(options = {}) {
      const { Cesium } = QE;
      const { rx, ry, rz, ps } = options;
      const mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(rx));
      const my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(ry));
      const mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(rz));
      const rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
      const rotationY = Cesium.Matrix4.fromRotationTranslation(my);
      const rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);
      // 平移 修改经纬度
      const position = Cesium.Cartesian3.fromDegrees(ps.lng, ps.lat, ps.alt);
      const m = Cesium.Transforms.eastNorthUpToFixedFrame(position);
      // 旋转、平移矩阵相乘
      Cesium.Matrix4.multiply(m, rotationX, m);
      Cesium.Matrix4.multiply(m, rotationY, m);
      Cesium.Matrix4.multiply(m, rotationZ, m);
      // 缩放 修改缩放比例
      // var scale = Cesium.Matrix4.fromUniformScale(this.tileModelTool.scale);
      // Cesium.Matrix4.multiply(m, scale, m);
      // 赋值给tileset
      return m;
    },
  },
};
</script>
<style lang="scss">
#app {
  width: 100%;
  // height: 450px;
  height: 100%;
}
#cesiumContainer {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
