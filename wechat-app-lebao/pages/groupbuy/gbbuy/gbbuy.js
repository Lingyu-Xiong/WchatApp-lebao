const app = getApp()
const util = require('../../../utils/util.js')
const payUrl = '/biz/trade/order/course/pay'
const getFormId ='/base/user/auth/wx/formid'
let animation
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSelect: true,
    index: 1,
    orderPrice:'',
    order:'',
    showModal: false,
    animationData: '', //动画效果
    password: [{
      hasValue: false,
      value: ''
    },
    {
      hasValue: false,
      value: ''
    },
    {
      hasValue: false,
      value: ''
    },
    {
      hasValue: false,
      value: ''
    },
    {
      hasValue: false,
      value: ''
    },
    {
      hasValue: false,
      value: ''
    }
    ],
    keyboard: [{
      key: 1,
      value: 1
    },
    {
      key: 2,
      value: 2
    },
    {
      key: 3,
      value: 3
    },
    {
      key: 4,
      value: 4
    },
    {
      key: 5,
      value: 5
    },
    {
      key: 6,
      value: 6
    },
    {
      key: 7,
      value: 7
    },
    {
      key: 8,
      value: 8
    },
    {
      key: 9,
      value: 9
    },
    {
      key: '完成',
      value: -1
    },
    {
      key: 0,
      value: 0
    }
    ],
    payPassword: '',
    payparams:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderPrice: options.orderPrice,
      order: options.order,
    })
  },

  chooseTap: function (e) {
    var that = this
    let index = e.currentTarget.dataset.index,
      isSelect = this.data.isSelect
    console.log(index)
    isSelect = !isSelect
    that.setData({
      isSelect: isSelect,
      index: index
    })
  },
  pay: function (e) {
    let index = this.data.index
    // 表单需设置report-submit="true"
    var formId = e.detail.formId;
    var openid=app.globalData.openid
    console.log(formId)
    console.log(openid)
    if (formId || 'the formId is a mock one' !== formId) {
      console.log(11)
      app.wxRequest(getFormId, {//后台收集formid
        formid: formId,
        openid: openid,
      }, 'get').then(res => {
        console.log(res.data)
        if (res.data.errno == 0) {
         
        } else {
          util.errorTip(res.data.errmsg)
          console.log(res.data.errmsg)
        }
      })
    }
    if (index == 1) {
      this.showModal()
    } else if (index == 2) {
      this.payWx()
    }
  },
  payBalance: function () {//余额支付
    let balance = parseFloat(this.data.orderPrice)
    app.wxRequest(payUrl, {
      order: parseInt(this.data.order),
      payType: 1,
      balance: balance, 
      payPwd: this.data.payPassword
    }).then(res => {
      console.log(res.data)
        if (res.data.errno == 0) {
          wx.showToast({
            title: '支付成功！',
            icon: 'success'
          })
          wx.redirectTo({
             url: 
//'/pages/my/mygroupbuy/gborderdetail/gborderdetail?orderid=' + parseInt(this.data.order),
               '/pages/my/mygroupbuy/mygroupbuy?groupRole=' + res.data.data.groupRole
          })
        } else {
          util.errorTip(res.data.errmsg)
          console.log(res.data.errmsg)
        }
    })
  },
  payWx: function () {//微信支付
    wx.showLoading({
      title: '支付中...',
    })
    let balance = parseFloat(this.data.orderPrice)
    app.wxRequest(payUrl, {
      order: parseInt(this.data.order),
      payType: 2,
      balance: balance,
    }).then(res => {
        if (res.data.errno == 0) {
          let data = res.data.data
          wx.hideLoading()
          let groupRole=data.groupRole
          wx.requestPayment({
            timeStamp: data.timeStamp,
            nonceStr: data.nonceStr,
            package: data.package,
            signType: data.signType,
            paySign: data.sign,
            success: function () {
              wx.showToast({
                title: '支付成功！',
                icon: 'success'
              })
              wx.redirectTo({
                url: '/pages/my/mygroupbuy/mygroupbuy?groupRole=' + groupRole
              })
            },
            fail: function (res) {
              util.errorTip('支付失败')
              console.log('fail', res)
            }
          })
        } else {
          wx.hideLoading()
          util.errorTip('支付失败')
        }
    })
  },
  init: function () {
    let list = []
    let data = {}
    for (var i = 0; i < 6; i++) {
      data = {}
      data.hasValue = false
      data.value = ''
      list.push(data)
    }
    this.setData({
      password: list,
      payPassword: ''
    })
  },
  showModal: function (e) {
    const that = this
    //判断用户是否设置支付密码
    const myInfo = app.globalData.myInfo
    if (!myInfo.hasOwnProperty('payPassword')) {
      util.errorTip('请先设置支付密码')
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/my/setting/reset/reset?phone=' + myInfo['mobile'] + '&event=pay'
        })
      }, 3000)
      return
    }
    that.setData({
      showModal: true
    })
    animation = wx.createAnimation({
      duration: 600, //动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    setTimeout(function () {
      that._fadeIn(); //调用显示动画
    }, 200)
  },
  getPassword: function (e) {
    const that = this
    const value = e.currentTarget.dataset.value
    if (that.data.payPassword.length == 6 || value == -1) {
      that.hideModal()
      that.payBalance()
    } else {
      let passwordList = that.data.password
      passwordList[that.data.payPassword.length].hasValue = true
      passwordList[that.data.payPassword.length].value = value
      let password = that.data.payPassword + value
      that.setData({
        password: passwordList,
        payPassword: password
      })
      if (password.length == 6) {

        that.payBalance()
        that.hideModal()
      }
    }
  },
  deletePassword: function () {
    const that = this
    let passwordList = that.data.password
    let payPassword = that.data.payPassword
    passwordList[payPassword.length - 1].hasValue = false
    passwordList[payPassword.length - 1].value = ''
    that.setData({
      password: passwordList,
      payPassword: payPassword.substring(0, payPassword.length - 1)
    })
    console.log(that.data.payPassword)
  },
  //动画函数
  _fadeIn: function () {
    animation.translateY(0).step()
    this.setData({
      animationData: animation.export()
    })
  },
  _fadeDown: function () {
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
  },

  // 隐藏遮罩层
  hideModal: function () {
    var that = this
    that.init()
    animation = wx.createAnimation({
      duration: 800, //动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    that._fadeDown(); //调用隐藏动画
    setTimeout(function () {
      that.setData({
        showModal: false
      })
    }, 720) //先执行下滑动画，再隐藏模块
  },
})