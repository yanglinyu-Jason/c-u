export default {
  props: {
    imageryType: {
      type: String,
      default: 'TMap'
    },
    defaultView: {
      type: Array,
      default: () => [117.1119439, 36.30287856, 7770925.91, 358.97, -89.97, 0]
    },
    //是否显示地名查找控件
    geocoder: {
      type: Boolean,
      default: false
    },
    homeButton: {
      type: Boolean,
      default: false
    },
    sceneModePicker: {
      type: Boolean,
      default: false
    },

    baseLayerPicker: {
      type: Boolean,
      default: false
    },
    navigationHelpButton: {
      type: Boolean,
      default: false
    },
    animation: {
      type: Boolean,
      default: false
    },
    timeline: {
      type: Boolean,
      default: false
    },

    fullscreenButton: {
      type: Boolean,
      default: false
    },
    vrButton: {
      type: Boolean,
      default: false
    },
    infoBox: {
      type: Boolean,
      default: false
    },
    selectionIndicator: {
      type: Boolean,
      default: false
    },

  },
  watch: {
    defaultView: {
      // console.log("------------",val)
      // // if (Array.isArray(val) && val !== oldVal) {
      // //   this.getViewer(viewer => {
      // //     console.log('2222',viewer)
      // //     viewer && viewer.setViewport(new Position(...val))
      // //   })
      // // }
      deep: true,
      immediate: true,
      handler(val, oldVal) {
        if (Array.isArray(val) && val !== oldVal) {
          this.getViewer(viewer => {
             console.log('2222',viewer)
            // //     viewer && viewer.setViewport(new Position(...val))
           })

        }
      }
    }
  },
  computed: {
    initDefaultView() {
      if (Array.isArray(this.defaultView) && this.defaultView.length === 0) {
        return new Position(
          117.1119439,
          36.30287856,
          7770925.91,
          358.97,
          -89.97,
          0
        )
      }
      return new Position(...this.defaultView)
    }

  },
  methods: {
    getViewer(viewerId){
      return viewerId
      // callback(viewerId)

    },

  },
  provide: function () {
    return { getViewer: this.getViewer }
  }
}
