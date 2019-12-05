// pages/my/setting/setting.js
const app = getApp()
const util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infroList: [{
        id: 1,
        question: 'aa',
        answer: 'aa',
      },
      {
        id: 2,
        question: 'bb',
        answer: 'bb',
      },
    ],
    uhide: 0,
    sysH: '',
    marTop: '',
    isIphone5: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this
    let marTop = app.globalData.sysH - 365
    let infroList = that.data.infroList
    app.wxRequest('/mall/admin/issue/list', {}, 'get').then(data => {
      const res = data
      let infroList = res.data.data.items
      that.setData({
        infroList: infroList
      })
    })
    that.setData({
      marTop: marTop,
      isIphone5: app.globalData.isIphone5
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
  
  toggleBtn: function(e) {
    var that = this
    var toggleBtnVal = that.data.uhide;
    var itemId = e.currentTarget.id;
    if (toggleBtnVal == itemId) {
      that.setData({
        uhide: 0
      })
    } else {
      that.setData({
        uhide: itemId
      })
    }
  },
  onShareAppMessage: function () {
    let that = this;
    return {
      title: '乐宝教育365', // 转发后 所显示的title
      path: '/pages/loading/loading'
    }
  }
})