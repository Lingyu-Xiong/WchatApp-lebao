// pages/my/expert/expert.js
const app = getApp()
const util = require('../../utils/util.js')
const expertUrl= '/mall/admin/expert/list'
let blockHeight = 90
Page({

  /**
   * 页面的初始数据
   */
  data: {
    expertList:[],
    inputName:'',
    expert: '/mall/admin/expert/list',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getExperts()

  },
  
  //请求专家list
  getExperts:function(){
    app.wxRequest(expertUrl, {
      type: 1,
      limit: 20,
      sort: 'collect_num'
    }, 'get').then(res => {
      console.log(res)
      const that = this
      if (res.data.errno == 0) {
        //请求成功，封装数据
        that.setData({
          expertList: res.data.data.items,
          //pageHeight: teacherList.length * blockHeight
        })
        console.log(that.data.expertList)
      } else {
        util.errorTip(res.data.errmsg)
      }
    })
  },
  goToExpertDetail: function (e) {
    const expertId = e.currentTarget.dataset.id
    console.log(expertId)
    wx.navigateTo({
      url: 'detail/detail?expertId=' + expertId,
    })
  },
  inputSelect: function (e) {
    this.setData({
      inputName: e.detail.value
    })
  },
  clearSelect: function () {
    this.setData({
      inputName: ''
    })
    this.search()
  },
  search: function (e) {
    this.getList()
  },
  getList: function () {
    let param = {
      limit: 50,
      name: this.data.inputName
    }
    app.wxRequest(expertUrl, param, 'get').then(res => {
      console.log(res)
      const that = this
      if (res.data.errno == 0) {
        //请求成功，封装数据
        that.setData({
          expertList: res.data.data.items,
          //pageHeight: teacherList.length * blockHeight
        })
        console.log(that.data.expertList)
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
    this.onLoad()
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