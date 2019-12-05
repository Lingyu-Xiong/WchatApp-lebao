// pages/videoCourse/courseDetail/courseDetail.js
const app = getApp()
const util = require('../../../utils/util.js')
const getdetailUrl = '/biz/trade/course/video/show/'
const getfeeKey = '/biz/trade/course/video/item/watch/'
const blockHeight = 80
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options:'',
    courseInfo:'',
    name:'',
    intro:'',
    coverUrl:'',
    courseNum:'',
    detailInfo:'',
    buyStatus:0,
    courseList:'',
    hasPayed:false,
    currentTab: 0,
    index: 0,
    tabbar: [{
      value: '课程介绍',
    },
    {
      value: '课程表',
    }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    app.wxRequest(getdetailUrl + id, {}, 'get').then(res => {
      console.log(res.data)
      if (res.data.errno === 0) {
        var name=res.data.data.name
        var intro=res.data.data.subName
        var courseNum=res.data.data.items.length
        var courseList=res.data.data.items
        var coverUrl = res.data.data.coverUrl
        var detailInfo = res.data.data.detailInfo
        var price = res.data.data.price
        var orgId = res.data.data.orgId
        if (res.data.data.buyStatus==1||price==0){
          var buyStatus =0
        } else{
          var buyStatus=1
        }
      
        console.log("buyStatus:" + buyStatus)
         this.setData({
           courseInfo:res.data.data,
           name:name,
           intro: intro,
           courseNum: courseNum,
           courseList: courseList,
           coverUrl: coverUrl,
           detailInfo: detailInfo,
           buyStatus: buyStatus,
           price: price,
           orgId: orgId,
           pageHeight: courseNum* blockHeight
         })

      } else {
        util.errorTip('获取失败')
        console.log(res.data.errmsg)
      }
    })
  },
  //点击切换teb页
  switchNav: function (e) {
    if (this.data.currentTab !== e.currentTarget.dataset.current) {
      this.setData({
        currentTab: parseInt(e.currentTarget.dataset.current),
      })
    }
  },
  //滑动切换tab页
  bindChange: function (e) {
    console.log(e)
    this.setData({
      currentTab: e.detail.current
    })
  },
  goToVideo:function(e){
    
    var key = e.currentTarget.dataset.video
    var title = e.currentTarget.dataset.title
    var id = e.currentTarget.dataset.id
    var cover = e.currentTarget.dataset.cover
    console.log(key)
    if (e.currentTarget.dataset.remark) {
      var remark = e.currentTarget.dataset.remark
    } else {
      var remark = '课程介绍正在来的路上~~'
    }
    if(key==null){
      
      app.wxRequest(getfeeKey + id, {}, 'get').then(res => {
        console.log(res.data)
        if (res.data.errno === 0) {
          key=res.data.data
          console.log(key)
          wx.navigateTo({
            url: '../video/video?key=' + key + '&title=' + title + '&remark=' + remark,
          })
        } else {
          util.errorTip(res.data.errmsg)      
          console.log(res.data.errmsg)
        }
      })
    }else{
      key = key.substring(41, e.currentTarget.dataset.video.length)
      wx.navigateTo({
        url: '../video/video?key=' + key + '&title=' + title + '&remark=' + remark + '&cover=' + cover,
      })
    }
   
    
  },
  signUp: function () {
    let courseinfo = {
      courseId:this.data.courseInfo.id,
      orderPrice: this.data.courseInfo.price,
      courseName: this.data.courseInfo.name,
      courseCover: this.data.courseInfo.coverUrl,
      orgId: this.data.orgId,
      orderType:1,

    }
    let courseinfoStr = JSON.stringify(courseinfo)
    console.log(courseinfoStr)
    wx.navigateTo({
      url: '../confirmOrder/confirmOrder?courseinfoStr=' + courseinfoStr
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