// pages/questionBank/rule/rule.js
const app = getApp()
const util = require('../../../utils/util.js')
const imageUrl = "https://lebao.oss-cn-beijing.aliyuncs.com/picture/weixin/questionBank"
const ruleUrl = '/biz/trade/question/rule/list'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.wxRequest(ruleUrl, { enabled: 1 },'get').then(res => {
      console.log(res.data.data.items[0].description)
      if (res.data.errno === 0) {
        if (res.data.data.items[0].description){
          this.setData({
            content:res.data.data.items[0].description
          })
          
        }
        
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