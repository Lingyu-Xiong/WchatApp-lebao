// pages/videoCourse/confirmOrder/confirmOrder.js
const app = getApp()
const util = require('../../../utils/util.js')
const createUrl = '/biz/trade/order/course/create'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseinfo: '',
    isIphone5: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    let courseinfo = JSON.parse(options.courseinfoStr)
    console.log(courseinfo)
    that.setData({
      courseinfo: courseinfo,
      isIphone5: app.globalData.isIphone5
    })
  },
  signUp: function () {
    let createinfo = {
      orderType: 1,
      courseId: parseInt(this.data.courseinfo.courseId),
      orderPrice: parseFloat(this.data.courseinfo.orderPrice),
      courseName: this.data.courseinfo.courseName,
      courseCover: this.data.courseinfo.courseCover,
      orgId: this.data.courseinfo.orgId,

    }
    app.wxRequest(createUrl, createinfo).then(res => {
      if (res.statusCode == 200) {
        console.log(res.data)
        if (res.data.errno == 0) {
          let data = res.data.data
          let orderinfo={
            orderSn :data.sn,
            id :data.id,
            name :data.orgName,
            addTime :data.addTime,
            orderPrice: data.orderPrice,
            
          }
          let orderinfoStr = JSON.stringify(orderinfo)
          wx.navigateTo({
            url: '../pay/pay?orderinfoStr=' + orderinfoStr
          })
        } else {
          wx.showToast({
            title: '该课程已购买！',
            icon: 'none',
            duration: 2000
          })
          setTimeout(function () {
            wx.navigateBack({
              delta:1,
            })
          }, 2000)

          console.log(res.data.errmsg)
        }
      } else {
        util.errorTip(res.errmsg)
        
        console.log(res.errmsg)
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