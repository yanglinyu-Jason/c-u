<template>
  <div style="width: 100%; height: 100%">
    <div id="cesiumContainer" ref="viewer" style="width: 100%; height: 100%" />
    <slot />
  </div>
</template>

<script>
import { viewerMixn } from "../../mixins";
export default {
  name: "CuViewer",
  mixins: [viewerMixn],
  beforeCreate() {
    this.$emit("init", this.cesium);
  },
  mounted() {
    let {
      imageryType,
      geocoder,
      homeButton,
      sceneModePicker,
      baseLayerPicker,
      navigationHelpButton,
      animation,
      timeline,
      fullscreenButton,
      vrButton,
      infoBox,
      selectionIndicator,
      cesium
    } = this;
    const viewer = new cesium.Viewer(this.$refs.viewer, {
      geocoder, //是否显示地名查找控件
      homeButton,
      sceneModePicker, //是否显示投影方式控件
      baseLayerPicker, //是否显示图层选择控件
      navigationHelpButton, //是否显示帮助信息控件
      animation, //是否显示动画控件(左下方那个)
      timeline, //是否显示时间线控件
      fullscreenButton,
      vrButton,
      infoBox, //去除原生自带右上角弹窗
      selectionIndicator, //点击球体显示绿色标识框
      imageryProvider: new cesium.WebMapTileServiceImageryProvider({
        url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=3cc6a8542f24dc95c8d1b7dfba10bbd0",
        layer: "tdtBasicLayer",
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "GoogleMapsCompatible",
        show: false,
        mininumLevel: 0,
        maximumLevel: 16,
      }),
    });
    this.$emit("ready", viewer);
  },
};
</script>
<style lang="scss">
* {
  padding: 0;
  margin: 0;
}
</style>
