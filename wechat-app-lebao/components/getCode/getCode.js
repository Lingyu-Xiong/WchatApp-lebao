// components/getCode/getCode.js
const app = getApp()
const util = require('../../utils/util.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isTransparent: {
      type: String
    },
    phoneInfo: {
      type: Object
    },
    url: {
      type: String
    },
    btnColor: {
      type: String
    },
    placeHolderColor: {
      type: String
    },
    inputColor: {
      type: String
    },
    backgroundColor: {
      type: String
    },
    border: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    code: '', //验证码
    codename: '获取验证码',
    isIphone5: app.globalData.isIphone5,
    send:1,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    inputCode: function(e) {
      this.setData({
        code: e.detail.value
      })
      this.triggerEvent('getcode', this.data.code)
    },

    getCode: function() {
      const that = this
      var phone = this.properties.phoneInfo.number
      var isValid = this.properties.phoneInfo.isValid
      let url = this.properties.url
      if (util.verifyLegal(phone, isValid, '手机号不能为空', '请输入正确的手机号')&&this.data.send) {
        app.wxRequest(url, {
          phone: phone
        }, 'get').then(res => {
          if (res.data.errno == 0) {
            var num = 61;
            var timer = setInterval(function() {
              num--;
              if (num <= 0) {
                clearInterval(timer);
                that.setData({
                  codename: '重新发送',
                  disabled: false,
                  send:1,
                })
              } else {
                that.setData({
                  codename: num + "s后重新发送",
                  send:0,
                })
              }
            }, 1000)
          } else if (res.data.errno == 634) {
            util.errorTip('该手机号已注册')
            console.log(res.data.errmsg)
          }else{
            util.errorTip('验证码获取失败')
            console.log(res.data.errmsg)
          }
        })
      }
    },
    //获取验证码
    getVerificationCode() {
      this.getCode();
      var that = this
      that.setData({
        disabled: true
      })
    }
  }
})