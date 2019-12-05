// pages/login/login.js
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    password: '',
    errmsg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },
  //输入姓名
  inputName: function(e) {
    this.setData({
      username: e.detail.value
    })
  },
  clearUsername: function() {
    this.setData({
      username: ''
    })
  },
  clearPassword: function() {
    this.setData({
      password: ''
    })
  },
  inputPassword: function(e) {
    this.setData({
      password: e.detail.value
    })
  },
  login: function() {
    const that = this
    const username = that.data.username + ''
    const password = that.data.password + ''
    if (username == '') {
      util.errorTip('用户名不能为空')
      return false
    }
    if (password == '') {
      util.errorTip('密码不能为空')
      return false
    }
    app.wxRequest('/base/user/auth/login/bond/wxmini', {
      "username": username,
      "password": password,
      "openid": app.globalData.openid
    }).then(res => {
      if (res.statusCode == '200') {
        if (res.data.errno == '0') {
          const sessionId = res.data.data
          app.globalData.session = sessionId
          wx.showToast({
            title: '绑定成功！',
            icon: 'success'
          })
          setTimeout(function() {
            wx.switchTab({
              url: '/pages/homepage/homepage',
            })
          }, 1500)
        } else if (res.data.errno == '590') {
          util.errorTip('该账号已被绑定')
          that.setData({
            username: '',
            password: ''
          })
        } else {
          util.errorTip('绑定失败')
          that.setData({
            password: '',
            errmsg: res.data.errmsg
          })
        }
      } else {

      }

    })
  },

  codeLogin: function() {
    wx.navigateTo({
      url: 'loginEvent/event?event=1',
    })
  },

  goToRegister: function() {
    wx.navigateTo({
      url: 'register/register',
    })
  },

  findPassword: function() {
    wx.navigateTo({
      url: 'loginEvent/event?event=0',
    })
  },
  onShareAppMessage: function () {
    let that = this;
    return {
      title: '乐宝教育365', // 转发后 所显示的title
      path: '/pages/loading/loading'
    }
  }

})