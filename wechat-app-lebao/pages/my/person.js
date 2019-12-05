// pages/my/person.js
const app = getApp()
const util = require('../../utils/util.js')
const imgURL = '../../images/my'
const updateUrl = '/base/user/account/update'
let reddot
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgURL: imgURL,
    reddot:'',
    username: '用户名akl',
    account: '12345678',
    balance: 100.00,
    integral: 100,
    isIphone5: false
  },

  getMoney: function(needStopRefresh) {
    const that = this
    app.wxRequest('/base/user/account/assert/my', 'get').then(data => {
      const res = data
      if (res.statusCode == 200) {
        let balance = res.data.balance.toFixed(2)
        let integral = res.data.vouchers
        that.setData({
          balance: balance,
          integral: integral
        })
      } else {
        util.errorTip('登录失败')
        that.setData({
          password: ''
        })
      }
      if (needStopRefresh) {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //this.getMoney()
    this.setData({
      isIphone5: app.globalData.isIphone5
    })
  },
  /**
   * 生命周期函数--监听页面显示  
   */
  onShow: function () {
    this.getMoney();
    this.isReddot()
  },
isReddot:function(){
  app.wxRequest('/base/user/account/info/my', {}, 'get')
    .then(data => {
      console.log(data.data)
      app.globalData.myInfo = data.data
      const myInfo = app.globalData.myInfo
      if (typeof (myInfo.realname) == 'undefined'||myInfo.realname=='') {
        reddot = true
      } else {
        reddot = false
      }
      console.log(reddot)
      this.setData({
        reddot:reddot
      })
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
  /**
   * 查看余额
   */
  viewBalance: function() {
    wx.navigateTo({
      url: 'balance/balance?total=' + this.data.balance,
    })
  },
  /**
   * 查看积分
   */
  viewIntegral: function() {
    wx.navigateTo({
      url: 'integral/integral?total=' + this.data.integral,
    })
  },
  /**
   * 充值
   */
  goToCharge: function() {
    wx.navigateTo({
      url: 'charge/charge?balance=' + this.data.balance,
    })
  },
  /**
   * 提现
   */
  withdrawal: function() {
    wx.navigateTo({
      url: 'withdrawal/withdrawal?balance=' + this.data.balance,
    })
  },
goToserve:function(){
  wx.navigateTo({
    url: 'serve/serve',
  })
},
//我的学员
  goToStudent: function () {
    wx.navigateTo({
      url: 'setting/student/student',
    })
  },
  //我的导学
  goTomygroupbuy: function () {
    wx.navigateTo({
      url: '/pages/my/mygroupbuy/mygroupbuy',
    })
  },
  order: function() {
    wx.navigateTo({
      url: 'order/order',
    })
  },
  courseorder: function () {
    wx.navigateTo({
      url: 'courseorder/order',
    })
  },
  setting: function() {
    wx.navigateTo({
      url: 'setting/setting',
    })
  },
  goTovideo:function(){
    // wx.showToast({
    //   title: '即将开放，敬请期待',
    //   icon: 'none'
    // })
    wx.navigateTo({
      url: 'myvideo/myvideo',
    })
  },
  myapply:function(){
    wx.navigateTo({
      url: 'exam/exam',
    })
  },
  onGotUserInfo:function(e){//同步
    console.log(e.detail.userInfo)
    let userInfo=e.detail.userInfo
    app.wxRequest(updateUrl, {
      nickname: userInfo.nickName,
      avatar:userInfo.avatarUrl,
      gender:userInfo.gender
    }).then(res => {
      console.log(res.data)
      if (res.data.errno == 0) {
        //请求成功
        wx.showToast({
          title: '同步成功！',
          icon: 'success'
        })
      } else {
        util.errorTip(res.errmsg)
      }
    })
  },
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getMoney(true)
  },
  onShareAppMessage: function () {
    let that = this;
    return {
      title: '乐宝教育365', // 转发后 所显示的title
      path: '/pages/loading/loading'
    }
  }
})