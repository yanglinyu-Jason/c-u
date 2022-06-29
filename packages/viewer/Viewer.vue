<template>
  <div style="width: 100%; height: 100%">
    <div id="cesiumContainer" ref="viewer" style="width: 100%; height: 100%" />
    <div class="latlng_show">
      <span>经度:{{ lat_String }}</span>
      <span>纬度:{{ log_String }}</span>
      <span>视角高:{{ alti_String }}km</span>
    </div>
    <slot />
  </div>
</template>
<script>
let Cesium = null;
let viewer = null;
export default {
  name: "CuViewer",
  props: {
    defaultView: {
      type: Object,
    },
  },

  beforeCreate() {
    // 初始化Cesium
    Cesium = this.Cesium;
  },
  data() {
    return {
      lat_String: "",
      log_String: "",
      alti_String: "",
      falg: false,
    };
  },
  mounted() {
    viewer = new Cesium.Viewer(this.$refs.viewer, {
      animation: false, //是否创建动画小器件，左下角仪表
      baseLayerPicker: false, //是否显示图层选择器
      fullscreenButton: false, //是否显示全屏按钮
      geocoder: false, //是否显示geocoder小器件，右上角查询按钮
      homeButton: false, //是否显示Home按钮
      infoBox: false, //是否显示信息框
      sceneModePicker: false, //是否显示3D/2D选择器
      selectionIndicator: false, //是否显示选取指示器组件
      timeline: false, //是否显示时间轴
      sceneMode: Cesium.SceneMode.SCENE3D, //设定3维地图的默认场景模式:Cesium.SceneMode.SCENE2D、Cesium.SceneMode.SCENE3D、Cesium.SceneMode.MORPHING
      navigationHelpButton: false, //是否显示右上角的帮助按钮
      scene3DOnly: true, //如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
      navigationInstructionsInitiallyVisible: true,
      showRenderLoopErrors: false, //是否显示渲染错误
    });
    // 罗盘展示
    var options = {};
    // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和Cesium.Rectangle.
    options.defaultResetView = Cesium.Cartographic.fromDegrees(
      115,
      30,
      2000000
    );
    // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
    options.enableCompass = true;
    // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件 将不会添加到地图中。
    options.enableZoomControls = true;
    // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
    options.enableDistanceLegend = true;
    // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
    options.enableCompassOuterRing = true;
    this.CesiumNavigation(viewer, options);
    // this.getPosition();
    // this.getFlyTO();
  },
  methods: {
    // 获取经纬度 信息
    getPosition() {
      let that = this;
      var canvas = viewer.scene.canvas;
      //具体事件的实现
      var ellipsoid = viewer.scene.globe.ellipsoid;
      var handler = new Cesium.ScreenSpaceEventHandler(canvas);
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
          var lat_String = Cesium.Math.toDegrees(cartographic.latitude);
          var log_String = Cesium.Math.toDegrees(cartographic.longitude);
          var alti_String = viewer.camera.positionCartographic.height / 1000;
          console.log(lat_String, log_String, alti_String);
          console.log(that);
          that.lat_String = lat_String;
          that.log_String = log_String;
          that.alti_String = alti_String;
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },

    getFlyTO() {
      // 这种方式切换视角有个过渡的过程，比较常用。
      // this.viewer.camera.flyTo({
      //   // fromDegrees()将经纬度和高程转换为世界坐标
      //   destination: Cesium.Cartesian3.fromDegrees(
      //     defaultView.lon,
      //     defaultView.lat,
      //     defaultView.alt
      //   ),
      //   orientation: {
      //     // 指向
      //     heading: defaultView.heading,
      //     // 视角
      //     pitch: defaultView.pitch,
      //     roll: defaultView.roll,
      //   },
      //   duration: 100, // 设置飞行持续时间，默认会根据距离来计算
      //   complete: function () {
      //     // 到达位置后执行的回调函数
      //   },
      //   cancle: function () {
      //     // 如果取消飞行则会调用此函数
      //   },
      //   pitchAdjustHeight: "", // 如果摄像机飞越高于该值，则调整俯仰俯仰的俯仰角度，并将地球保持在视口中。
      //   maximumHeight: "", // 相机最大飞行高度
      //   flyOverLongitude: "", // 如果到达目的地有2种方式，设置具体值后会强制选择方向飞过这个经度(这个，很好用)
      // });

      // 这种方式是直接切换到目标视角，比较生硬，没有过渡效果。
      let { lon, lat, alt, heading, pitch, range } = this.defaultView;
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(lon, lat, alt), // 设置位置
        orientation: {
          heading: Cesium.Math.toRadians(20.0), // 方向
          pitch: Cesium.Math.toRadians(-90.0), // 倾斜角度
          roll: 0,
        },
      });
      // 直接定位-lookAt
      // 这种方式跟setView一样，都是直接切换到目标视角。
      // let destination = Cesium.Cartesian3.fromDegrees(lon, lat, alt);
      // let orientation = new Cesium.HeadingPitchRange(heading, pitch, range);
      // viewer.scene.camera.lookAt(destination, orientation);
    },
  },
};
</script>
<style lang="scss">
* {
  padding: 0;
  margin: 0;
}
.latlng_show {
  width: 100%;
  height: 20px;
  line-height: 20px;
  // border: 1px solid red;
  position: absolute;
  // top:0;
  bottom: 10px;
  color: red;
}
// 去掉logo
.cesium-widget-credits {
  display: none !important;
  visibility: hide !important;
}
</style>
