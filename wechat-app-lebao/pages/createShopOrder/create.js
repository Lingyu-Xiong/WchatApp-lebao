// pages/createOrder/create.js
const app = getApp()
const util = require('../../utils/util.js')
const createUrl = '/biz/trade/order/consume/create'
const payUrl = '/biz/trade/order/consume/pay'
const cancelUrl = '/biz/trade/order/consume/cancel'
let animation
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '阳光英语',
    orderSn: '',
    id:'',
    addTime: '',
    orderPrice: '',
    actualPrice: '',
    isIphone5: false,
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
    payPassword: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this
    let brandId = options.brandId,
      goodsPrice = options.goodsPrice,
      orderType = options.orderType
    that.setData({
      brandId: brandId,
      goodsPrice: goodsPrice,
      orderType: orderType,
      isIphone5: app.globalData.isIphone5
    })
    app.wxRequest(createUrl, {
      orgId: brandId,
      goodsPrice: goodsPrice,
      orderType: orderType
    }).then(res => {
        if (res.data.errno == 0) {
          let data = res.data.data
          let orderSn = data.orderSn,
          id=data.id,
            name = data.orgName,
            addTime = data.addTime,
            orderPrice = data.orderPrice
          that.setData({
            orderSn: orderSn,
            id:id,
            addTime: addTime,
            orderPrice: orderPrice,
            name: name
          })
        } else {
          util.errorTip(res.data.errmsg)
          console.log(res.data.errmsg)
        }
    })
  },
  pay: function() {
    const that = this
    app.wxRequest(payUrl, {
      orderSn: that.data.orderSn,
      payAmount: that.data.goodsPrice,
      payPwd: that.data.payPassword
    }).then(res => {
      if (res.statusCode == 200) {
        if (res.data.errno == 0) {
          wx.redirectTo({
            url: '/pages/my/order/details/details?sn=' + that.data.orderSn + '&id=' + that.data.id,
          })
        } else {
          util.errorTip(res.data.errmsg)
          console.log(res.data.errmsg)
        }
      } else {
        util.errorTip('请求失败')
        console.log(res.data.errmsg)
      }
    })
  },
  cancle: function() {
    const that = this
    wx.showModal({
      title: '取消订单',
      content: '确认取消订单嘛?',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '取消中...',
          })
          app.wxRequest(cancelUrl, {
            sn: that.data.orderSn
          }, 'get').then(res => {
            if (res.statusCode == 200) {
              if (res.data.errno == 0) {
                wx.hideLoading()
                wx.showToast({
                  title: '取消成功！',
                  icon: 'success'
                })
                setTimeout(function() {
                  wx.redirectTo({
                    url: '/pages/my/order/details/details?sn=' + that.data.orderSn + '&id=' + that.data.id,
                  })
                }, 1500)
              } else {
                wx.hideLoading()
                util.errorTip('取消订单失败')
                console.log(res.data.errmsg)
              }
            } else {
              wx.hideLoading()
              util.errorTip('请求失败')
              console.log(res.errmsg)
            }
          })
        }
      }
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
  init: function() {
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
  showModal: function(e) {
    const that = this
    const myInfo = app.globalData.myInfo
    if (!myInfo.hasOwnProperty('payPassword')) {
      util.errorTip('请先设置支付密码')
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/my/setting/reset/reset?phone=' + myInfo['mobile'] + '&event=pay'
        })
      }, 2000)
      return
    }
    that.setData({
      showModal: true
    })
    animation = wx.createAnimation({
      duration: 600, //动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    setTimeout(function() {
      that._fadeIn(); //调用显示动画
    }, 200)
  },
  getPassword: function(e) {
    const that = this
    const value = e.currentTarget.dataset.value
    if (that.data.payPassword.length == 6 || value == -1) {
      that.hideModal()
      that.pay()
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

        that.pay()
        that.hideModal()
      }
    }
  },
  deletePassword: function() {
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
  _fadeIn: function() {
    animation.translateY(0).step()
    this.setData({
      animationData: animation.export()
    })
  },
  _fadeDown: function() {
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
  },

  // 隐藏遮罩层
  hideModal: function() {
    var that = this
    that.init()
    animation = wx.createAnimation({
      duration: 800, //动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    that._fadeDown(); //调用隐藏动画
    setTimeout(function() {
      that.setData({
        showModal: false
      })
    }, 720) //先执行下滑动画，再隐藏模块
  },
  onShareAppMessage: function () {
    let that = this;
    return {
      title: '乐宝教育365', // 转发后 所显示的title
      path: '/pages/loading/loading'
    }
  }
})