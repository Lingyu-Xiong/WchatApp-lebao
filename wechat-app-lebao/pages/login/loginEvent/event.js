// pages/login/loginEvent/event.js
const app = getApp()
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    event: 1, //'0'代表忘记密码,'1'代表手机验证码登录
    buttonText: '确 定',
    buttonEvent: 'login',
    phone: '',
    password: '',
    ensurePassword: '',
    url: '',
    phoneInfo: {
      number: '',
      isValid: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this
    const event = options.event
    let url = ''
    if (event == '0') {
      url = '/base/user/auth/auth/captcha/password'
    } else {
      url = '/base/user/auth/captcha/bond_phone'
    }
    that.setData({
      eventChange: event,
      url: url,
      modifyPhone: that.data.phoneInfo
    })
  },
  clearPhone: function() {
    this.setData({
      phone: ''
    })
  },
  clearEnsurePassword: function() {
    this.setData({
      ensurePassword: '',
      ensurePassword_valid: 'invalid'
    })
  },
  clearPassword: function() {
    this.setData({
      password: '',
      password_valid: 'invalid'
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

  getCode: function(e) {
    const that = this
    let code = e.detail
    that.setData({
      code: code
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
  login: function() {
    const that = this
    const phone = that.data.phone
    const code = that.data.code
    if (util.verifyLegal(phone, that.data.phone_valid, '手机号不能为空', '请输入正确的手机号')) {
      if (code == '') {
        util.errorTip('请输入验证码')
        return false
      } else {
        if (that.data.eventChange == '1') {
          //手机验证码登录
          app.wxRequest('/base/user/auth/login/bond/wxmini/phone', {
            mobile: phone,
            captcha: code,
            openid: app.globalData.openid
          }).then(res => {
            if (res.statusCode == 200) {
              if (res.data.errno == 0) {
                app.globalData.session = res.data.data
                wx.switchTab({
                  url: '/pages/homepage/homepage',
                })
              } else if (res.data.errno == 501) {
                util.errorTip('该手机号未注册')
                that.setData({
                  phone: '',
                  code: ''
                })
              } else if (res.data.errno == 590) {
                util.errorTip('该手机号已被绑定')
                that.setData({
                  phone: '',
                  code: ''
                })
              } else {
                util.errorTip('绑定失败')
              }
            } else {
              util.errorTip('请求失败')
            }

          })
        } else {
          that.setData({
            event: 0,
            buttonText: '确定修改',
            buttonEvent: ''
          })
        }
      }
    }
  },
  changePassword: function() {
    const that = this
    const password = that.data.password
    const ensurePassword = that.data.ensurePassword
    const code = that.data.code
    if (util.verifyLegal(password, that.data.password_valid, '密码不能为空', '不少于6个字符')) {
      if (util.verifyLegal(ensurePassword, that.data.ensurePassword_valid, '确认密码不能为空', '两次密码不一致')) {
        app.wxRequest('/base/user/aut/password/forget', {
          password: password,
          mobile: phone,
          captcha: code
        }).then(res => {
          if (res.errno === 0) {
            wx.showToast({
              title: '设置成功！',
              icon: 'sucess'
            })
            setTimeout(function() {
              that.back()
            }, 1500)
          } else {
            util.errorTip('重置密码失败')
            console.log(res.errmsg)
          }
        })
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