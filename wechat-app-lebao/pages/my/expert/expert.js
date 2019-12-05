// pages/my/expert/expert.js
const app = getApp()
const util = require('../../../utils/util.js')
const expertUrl= '/mall/admin/expert/list'
let blockHeight = 90
Page({

  /**
   * 页面的初始数据
   */
  data: {
    expertList:[],
    expertUrl: '/mall/admin/expert/list',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //请求专家list
    app.wxRequest(expertUrl, {
      type: 1,
      limit: 20
    }, 'get').then(res => {
      console.log(res)
      const that=this
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
  goToExpertDetail: function () {
    const that = this
    app.wxRequest(that.data.expertUrl, {
      limit: 100
    }, 'get').then(res => {
      if (res.statusCode == 200) {
        console.log(res.data)
        if (res.data.errno == 0) {/*
          let list = res.data.data.items
          let data = {}
          let expertList = []
          for (var i = 0; i < list.length; i++) {
            data = {}
            data.id = list[i].id
            data.title = list[i].name
            data.picUrl = util.jointUrl(list[i].pictureUrl)
            data.desc = list[i].description
            expertList.push(data)
          }
          that.setData({
            expertList: expertList,
            pageHeight: teacherList.length * blockHeight
          })
        */} else {
          util.errorTip('获取失败')
          console.log(res.data.errmsg)
        }
      } else {
        util.errorTip('请求失败')
        console.log(res.errmsg)
      }
    })
  },
  search: function () {
    wx.navigateTo({
      url: '/pages/search/search?page=school',
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