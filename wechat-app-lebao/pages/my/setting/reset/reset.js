// pages/my/setting/reset/reset.js
const app = getApp()
const util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    password: '',
    newPassword: '',
    passMaxLen: 10,
    ensurePassword: '',
    phone: '',
    phoneInfo: {
      number: '',
      isValid: ''
    },
    url: '/base/user/captcha/paypassword',
    code: '',
    event: '',
    ensureEvent: '',
    errmsg: '',
    send:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this
    if (options.event == 'pay') {
      let phone = {}
      phone.number = ''
      phone.isValid = 'invalid'
      that.setData({
        modifyPhone: phone,
        eventText: '支付',
        eventTitle: '设置支付密码',
        url: '/base/user/captcha/paypassword',
        ensureEvent: 'changePayPassword',
        passMaxLen: 6
      })
      wx.setNavigationBarTitle({
        title: "重置支付密码"
      })
    } else if (options.event == 'login') {
      that.setData({
        eventText: '登录',
        eventTitle: '重置登录密码',
        ensureEvent: 'changeLoginPassword'
      })
      wx.setNavigationBarTitle({
        title: "重置登录密码"
      })
    } else {
      that.setData({
        mobile: options.phone,
        modifyPhone: that.data.phoneInfo,
        eventTitle: '重置手机号',
        url: '/base/user/captcha/mobile',
        ensureEvent: 'changePhone'
      })
      wx.setNavigationBarTitle({
        title: "重置手机号"
      })
    }
    that.setData({
      event: options.event,
      isIphone5: app.globalData.isIphone5
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
  clearPhone: function() {
    this.setData({
      phone: '',
      phone_valid: 'invalid'
    })
  },
  inputPassword: function(e) {
    this.setData({
      password: e.detail.value
    })
  },
  clearPassword: function() {
    this.setData({
      password: ''
    })
  },
  inputNewPassword: function(e) {
    if (e.detail.value.length < 6) {
      this.setData({
        new_password_valid: 'invalid',
        newPassword: e.detail.value
      })
    } else {
      this.setData({
        new_password_valid: '',
        newPassword: e.detail.value
      })
    }
  },
  clearNewPassword: function() {
    this.setData({
      new_password_valid: 'invalid',
      newPassword: ''
    })
  },
  inputEnsurePassword: function(e) {
    if (e.detail.value != this.data.newPassword) {
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
  clearEnsurePassword: function() {
    this.setData({
      ensurePassword_valid: 'invalid',
      ensurePassword: ''
    })
  },
  getCode: function(e) {
    const that = this
    let code = e.detail
    that.setData({
      code: code
    })
  },
  changeLoginPassword: function() {
    const that = this
    const newPassword = that.data.newPassword
    const password = that.data.password
    const ensurePassword = that.data.ensurePassword
    if (password == '') {
      util.errorTip('请输入旧密码')
      return false
    } else {
      if (util.verifyLegal(newPassword, that.data.new_password_valid, '请输入新密码', '密码长度不得超过6位')) {
        if (util.verifyLegal(ensurePassword, that.data.ensurePassword_valid, '确认密码不能为空', '两次密码不一致')) {
          wx.showLoading({
            title: '修改中...',
          })
          app.wxRequest('/base/user/reset/password', {
            "password": password,
            "newpassword": newPassword,
          }).then(res => {
            if (res.statusCode == 200) {
              if (res.data.errno === 0) {
                wx.hideLoading()
                wx.showToast({
                  title: '修改成功!',
                  icon: 'success'
                })
                setTimeout(function() {
                  that.back()
                }, 1500)
              } else if (res.data.errno == -1) {
                wx.hideLoading()
                util.errorTip('旧密码输入错误')
                that.setData({
                  errmsg: '旧密码输入错误'
                })
              } else {
                wx.hideLoading()
                util.errorTip('修改失败')
                that.setData({
                  errmsg: res.data.errmsg
                })
                console.log(res.data.errmsg)
              }
            } else {
              util.errorTip('请求失败')
            }
          })
        }
      }
    }
  },
  changePhone: function() {
    const that = this
    const phone = that.data.phone
    const code = that.data.code
    if (util.verifyLegal(phone, that.data.phone_valid, '请输入手机号', '请输入正确的手机号')) {
      if (code == '') {
        util.errorTip('请输入验证码')
        return false
      } else {
        wx.showLoading({
          title: '修改中...',
        })
        app.wxRequest('/base/user/reset/mobile', {
          mobile: that.data.mobile,
          newmobile: phone,
          captcha: code
        }).then(res => {
          if (res.statusCode == 200) {
            if (res.data.errno === 0) {
              wx.hideLoading()
              wx.showToast({
                title: '修改成功!',
                icon: 'success'
              })
              setTimeout(function() {
                that.back()
              }, 1500)
            } else {
              wx.hideLoading()
              util.errorTip('修改失败')
              that.setData({
                errmsg: res.data.errmsg
              })
              console.log(res.data.errmsg)
            }
          } else {
            util.errorTip('请求失败')
          }
        })
      }
    }
  },
  changePayPassword: function() {
    const that = this
    const phone = that.data.phone
    const newPassword = that.data.newPassword
    const ensurePassword = that.data.ensurePassword
    const code = that.data.code
    if (util.verifyLegal(phone, that.data.phone_valid, '手机号不能为空', '请输入正确的手机号') &&
      util.verifyLegal(newPassword, that.data.new_password_valid, '新密码不能为空', '密码字符数>6') &&
      util.verifyLegal(ensurePassword, that.data.ensurePassword_valid, '确认密码不能为空', '两次密码不一致')) {
      if (code == '') {
        util.errorTip('请输入您的验证码')
        return false
      } else {
        wx.showLoading({
          title: '修改中...',
        })
        app.wxRequest('/base/user/reset/paypassword', {
          mobile: phone,
          newpaypassword: newPassword,
          captcha: code
        }).then(res => {
          if (res.statusCode == 200) {
            if (res.data.errno === 0) {
              wx.hideLoading()
              wx.showToast({
                title: '修改成功!',
                icon: 'success'
              })
              //修改成功，填充支付密码字段，无需重新请求
              app.globalData.myInfo['payPassword'] = ''
              setTimeout(function() {
                that.back()
              }, 1500)
            } else {
              wx.hideLoading()
              util.errorTip(res.data.errmsg)
              that.setData({
                errmsg: res.data.errmsg
              })
            }
          } else {
            util.errorTip('请求失败')
          }
        })
      }
    }
  },
  back: function() {
    wx.navigateBack({
      delta: 1,
      success: function(e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
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