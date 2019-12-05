Page({
  data: {
    longitude: 113.324520,
    latitude: 23.099994
  },
  onLoad: function(options) {
    wx.openLocation({
      latitude: options.latitude * 1,
      longitude: options.longitude * 1,
      success: function(res) {
        console.log('res',res)
      }
    })
  },
  onShareAppMessage: function () {
    let that = this;
    return {
      title: '乐宝教育365', // 转发后 所显示的title
      path: '/pages/loading/loading'
    }
  }
})