import Vue from 'vue'
import App from './App.vue'
// 导入组件库
import CuUI from '../packages'
Vue.config.productionTip = false
import * as Cesium from "cesium/Cesium";
import widget from "cesium/Widgets/widgets.css";
import CesiumNavigation from 'cesium-navigation-es6'
// 定义为全局变量，以便调用
Vue.prototype.Cesium = Cesium;
Vue.prototype.widgets = widget;
Vue.prototype.CesiumNavigation = CesiumNavigation;



Vue.use(CuUI)

new Vue({
  render: h => h(App)
}).$mount('#app')
