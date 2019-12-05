// pages/my/order/details/details.js
const app = getApp()
const util = require('../../../../utils/util.js')
const getUrl = '/biz/trade/order/consume/read/'
const payUrl = '/biz/trade/order/consume/pay'
const cancelUrl = '/biz/trade/order/consume/cancel'
const cancelRefund = '/biz/trade/refund/delete'
let animation
Page({

  /**
   * 页面的初始数据
   */
  data: {
    student:'',
    objName:'',
    objLogo:'',
    orderSn:'',
    orgName: '',
    status: '',
    statusText: '',
    picUrl: '',
    addTime: '',
    price: '',
    address:'' ,
    phone: '',

    isIphone5: false,
    showModal: false,
    animationData: '', //动画效果
    isStore: false,
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
 
    this.setData({
      id: options.id,
      isIphone5: app.globalData.isIphone5
    })
    app.wxRequest(getUrl + options.id, {
    }, 'get').then(res => {
      console.log(res.data.data)
      if (res.data.errno == 0) {
        let data = res.data.data
        let objName, objLogo, student
        let orgName = data.orgName,
          status = data.orderStatus,
          statusText = '',
          picUrl = util.jointUrl(data.orgIndoorUrl),
          addTime = data.addTime,
          price = data.orderPrice,
          phone = data.orgPhonePrimary,
          address = data.orgAddress,
          orderSn=data.orderSn,
          isStore = data.orderType == 0 ? true : false
          if(!isStore){
            objName=data.objName,
              objLogo = util.jointUrl(data.objLogo),
              student=data.details
          }else{
            objName =null,
              objLogo = null,
              student=null
          }
        switch (data.orderStatus) {
          case 0:
            statusText = '待支付'
            break
          case 1:
            statusText = '已完成'
            break
          case 2:
            statusText = '退款'
            break
          case 3:
            statusText = '已取消'
            break
          case 4:
            statusText = '已评价'
            break
        }
    
        this.setData({
          student:student,
         objName:objName,
         objLogo:objLogo,
          orgName: orgName,
          orderSn:orderSn,
          status: status,
          statusText: statusText,
          picUrl: picUrl,
          addTime: addTime,
          price: price,
          address: address,
          phone: phone,
          isStore: isStore
        })
        
      } else {
        util.errorTip('获取失败')
        console.log(res.data.errmsg)
      }
    })
  },

  cancel: function() {
    const that = this
    const orderSn = e.currentTarget.dataset.orderSn
    wx.showModal({
      title: '取消订单',
      content: '确认取消订单吗?',
      success: function(res) {
        if (res.confirm) {
          app.wxRequest(cancelUrl, {
            sn: orderSn
          }, 'get').then(res => {
            if (res.data.errno == 0) {
              wx.showToast({
                title: '取消成功！',
                icon: 'success'
              })
              that.onLoad()
            } else {
              util.errorTip('取消订单失败')
              console.log(res.data.errmsg)
            }
          })
        }
      }
    })
  },
  applyRefund: function(e) {
    const orderSn = e.currentTarget.dataset.orderSn
    wx.navigateTo({
      url: '../refund/apply/apply?sn=' + orderSn,
    })
  },
  refundDetail: function(e) {
    const orderSn = e.currentTarget.dataset.orderSn
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../refund/details/details?orderSn=' + orderSn,
    })
  },
  pay: function () {   
    const that = this
    console.log(that.data.payPassword)
    app.wxRequest(payUrl, {
      orderSn: that.data.orderSn,
      payAmount: that.data.price,
      payPwd: that.data.payPassword
    }).then(res => {
      if (res.data.errno == 0) {
        wx.redirectTo({
          url: '/pages/my/order/details/details?' + that.data.orderSn+'&id='+that.data.id,
        })
      } else {
        util.errorTip('支付失败')
        console.log(res.data.errmsg)
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
  
  showModal: function(e) {
    const that = this
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
  cancel: function(e) {
    const that = this
    const orderSn = that.data.orderSn
    wx.showModal({
      title: '取消订单',
      content: '确认取消订单吗?',
      success: function(res) {
        if (res.confirm) {
          app.wxRequest(cancelUrl, {
            sn: orderSn
          }, 'get').then(res => {
            if (res.statusCode == 200) {
              if (res.data.errno == 0) {
                wx.showToast({
                  title: '取消成功！',
                  icon: 'success'
                })
                that.onLoad()
              } else {
                util.errorTip('取消订单失败')
                console.log(res.data.errmsg)
              }
            } else {
              util.errorTip('请求失败')
              console.log(res.errmsg)
            }
          })
        }
      }
    })
  },
  evaluate: function() {
    wx.showModal({
      title: '待开发',
      content: '该页面没有设计，没有接口',
    })
  },
  applyRefund: function(e) {
    const orderSn = e.currentTarget.dataset.orderSn
    wx.navigateTo({
      url: '../../refund/apply/apply?sn=' + orderSn,
    })
  },
  refundDetail: function(e) {
    const orderSn = e.currentTarget.dataset.orderSn
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../refund/details/details?orderSn=' + orderSn,
    })
  },
  cancelRefund: function() {
    const that = this
    const orderSn = e.currentTarget.dataset.orderSn
    const brandId = e.currentTarget.dataset.brandId
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '取消退款',
      content: '确认取消退款吗?',
      success: function(res) {
        if (res.confirm) {
          app.wxRequest(cancelRefund, {
            id: brandId,
            orderSn: orderSn
          }, 'get').then(res => {
            if (res.statusCode == 200) {
              if (res.data.errno == 0) {
                wx.showToast({
                  title: '取消成功！',
                  icon: 'success'
                })
                that.onLoad()
              } else {
                util.errorTip('取消订单失败')
                console.log(res.data.errmsg)
              }
            } else {
              util.errorTip('请求失败')
              console.log(res.errmsg)
            }
          })
        }
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