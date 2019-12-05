// pages/my/serve/volrec/volrec.js
const app = getApp()
const util = require('../../../../utils/util.js')
const getVolrecUrl = '/biz/trade/voluntary/record/list/my'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphone5: false,
    signList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
    that.setData({
      isIphone5: app.globalData.isIphone5,
    })
    app.wxRequest(getVolrecUrl, {
      limit: 20
    }, 'get').then(res => {
      console.log(res.data)
      if (res.data.errno === 0) {
        let signList = res.data.data.items
        this.setData({
          signList: signList
        })

      } else {
        util.errorTip('获取失败')
        console.log(res.data.errmsg)
      }
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  
  back: util.back,
  onShareAppMessage: function () {
    let that = this;
    return {
      title: '乐宝教育365', // 转发后 所显示的title
      path: '/pages/loading/loading'
    }
  }
})