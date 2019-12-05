// pages/expert/detail/detail.js
const app = getApp()
const util = require('../../../utils/util.js')
const expertUrl='/mall/admin/expert/read/'
const visitUrl = '/mall/admin/expert/visit/'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    backUrl: '',
    expertName:'',
    description:'',
    expertId:'',
    collectNum:''
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let expertId = options.expertId
      this.setData({
        expertId: expertId,
        isIphone5: app.globalData.isIphone5,
      })
    this.getDetail(expertId)
    this.addVisit(expertId)
  },
  // 增加浏览量
  addVisit: function (id) {
    app.wxRequest(visitUrl +id, {
    }, 'get').then(res => {
      console.log(res)
      const that = this
      if (res.data.errno == 0) {
        //请求成功，封装数据
      
      } else {
        util.errorTip(res.data.errmsg)
      }
    })
  },
  getDetail: function (expertId){
    //请求专家详情
    app.wxRequest(expertUrl + expertId, {}, 'get').then(res => {
      console.log(res)
      if (res.data.errno == 0) {
        //请求成功，封装数据
        var description = res.data.data.description
        var backUrl = 'https://lebao.oss-cn-beijing.aliyuncs.com/picture/weixin/questionBank/no-image.png'
        if (res.data.data.backUrl) {
          backUrl = res.data.data.backUrl
        }
        var collectNum = res.data.data.collectNum
        var expertName = res.data.data.name
        this.setData({
          expertName: expertName,
          backUrl: backUrl,
          description: description,
          collectNum: collectNum
        })
      } else {
        util.errorTip(res.data.errmsg)
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