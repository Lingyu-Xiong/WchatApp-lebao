// pages/videoCourse/video/video.js
const app = getApp()
const util = require('../../../utils/util.js')
const videoUrl = '/res/file/oss/getUrl'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    url:'',
    remark:'',
    cover:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    //设置页面标题
    wx.setNavigationBarTitle({
      title: options.title
    })
    app.wxRequest(videoUrl, {key:options.key}, 'get').then(res => {
      console.log(res.data)
      if (res.data.errno === 0) {
        this.setData({
          url:res.data.data,
          remark: options.remark,
          cover:options.cover
        })

      } else {
        util.errorTip('获取失败')
        console.log(res.data.errmsg)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})