// pages/login/register/register.js
const app = getApp()
const imgURL = '../../../images'
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '', //姓名
    phone: '', //手机号
    password: '',
    ensuerPassword: '',
    phoneInfo: {
      number: '',
      isValid: ''
    },
    isregister: true,
    url: '/base/user/auth/captcha/bond_phone'
  },

  /**
   * 生命周期函数-监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      isregister:true,
      modifyPhone: this.data.phoneInfo
    })
  },
  clearPhone: function() {
    this.setData({
      phone: ''
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
  //输入姓名
  inputName: function(e) {
    if (e.detail.value.length < 6) {
      this.setData({
        username_valid: 'invalid',
        username: e.detail.value
      })
    } else {
      this.setData({
        username_valid: '',
        username: e.detail.value
      })
    }
  },

  //输入手机号码
  inputPhone: function(e) {
    if (!/^((13[0-9])|(14[5,7,9])|(15[^4])|(16[6])|(17[0,1,2,3,5,6,7,8])|(18[0-9])|(19[8,9]))\d{8}$/.test(e.detail.value)) {
      this.setData({
        phone_valid: 'invalid',
        phone: e.detail.value
      })
    } else {
      this.setData({
        phone_valid: '',
        phone: e.detail.value
      })
    }
    let phone = {}
    phone.number = e.detail.value
    phone.isValid = this.data.phone_valid
    this.setData({
      modifyPhone: phone
    })
  },
  inputPassword: function(e) {
    if (e.detail.value.length < 6) {
      this.setData({
        password_valid: 'invalid',
        password: e.detail.value
      })
    } else {
      this.setData({
        password_valid: '',
        password: e.detail.value
      })
    }
  },
  inputEnsurePassword: function(e) {
    if (e.detail.value != this.data.password) {
      this.setData({
        ensurePassword_valid: 'invalid',
        ensurePassword: e.detail.value
      })
    } else {
      this.setData({
        ensurePassword_valid: '',
        ensurePassword: e.detail.value
      })
    }
  },
  getCode: function(e) {
    const that = this
    let code = e.detail
    that.setData({
      code: code
    })
  },
  register: function() {
    const that = this
    const phone = that.data.phone
    const username = that.data.username
    const password = that.data.password
    const ensurePassword = that.data.ensurePassword
    const code = that.data.code
    if (util.verifyLegal(phone, that.data.phone_valid, '手机号不能为空', '请输入正确的手机号')) {
      if (code == '') {
        util.errorTip('请输入验证码')
        return false
      } else {
        var getUidInterval = setInterval(function() {
          if (app.globalData.openid != '') {
            clearInterval(getUidInterval)
            clearTimeout(timer)
            app.wxRequest('/base/user/auth/login/bond/wxmini/phone', {
              mobile: phone,
              captcha: code,
              openid: app.globalData.openid
            }).then(res => {
              if (res.statusCode == 200) {
                if (res.data.errno == '0') {
                  const sessionId = res.data.data
                  app.globalData.session = sessionId
                  app.getMyInfo()
                  wx.showToast({
                    title: '绑定成功！',
                    icon: 'success'
                  })
                  setTimeout(function() {
                    wx.switchTab({
                      url: '/pages/homepage/homepage',
                    })
                  }, 1500)
                } else {
                  util.errorTip(res.data.errmsg)
                  that.setData({
                    password: '',
                    errmsg: res.data.errmsg
                  })
                }
              } else {
                util.errorTip('请求失败')
              }
            })
          } else {
            var timer = setTimeout(function() {
              clearInterval(getUidInterval)
              if (app.globalData.uid == 0) {
                util.errorTip('授权失败')
              }
            }, 8000);
          }
        }, 1000)
      }
    }
  },
  onShareAppMessage: function () {
    let that = this;
    return {
      title: '乐宝教育365', // 转发后 所显示的title
      path: '/pages/loading/loading'
    }
  }
})